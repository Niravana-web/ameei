import "server-only";
import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  type BucketLocationConstraint,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set — required for S3 uploads.`);
  return v;
}

const REGION = () => env("AWS_REGION");
const BUCKET = () => env("S3_BUCKET_NAME");

let client: S3Client | undefined;
function s3(): S3Client {
  if (!client) {
    client = new S3Client({
      region: REGION(),
      credentials: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }
  return client;
}

export function publicUrl(key: string): string {
  return `https://${BUCKET()}.s3.${REGION()}.amazonaws.com/${key}`;
}

// ponytail: in-memory flag — only hit the create/policy APIs once per process.
let ensured = false;

/** Make sure the bucket exists and serves objects publicly. Idempotent. */
export async function ensureBucket(): Promise<void> {
  if (ensured) return;
  const Bucket = BUCKET();
  const region = REGION();

  try {
    await s3().send(new HeadBucketCommand({ Bucket }));
    ensured = true;
    return; // exists and we can reach it
  } catch (e) {
    const status = (e as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
    const name = (e as { name?: string })?.name;
    // 403 = exists but owned by another account / no access — not ours to create.
    if (status === 403 || name === "Forbidden") {
      throw new Error(
        `S3 bucket "${Bucket}" exists but is not accessible with these credentials.`,
      );
    }
    // 404 / NotFound / NoSuchBucket → fall through to create.
    if (status !== 404 && name !== "NotFound" && name !== "NoSuchBucket") throw e;
  }

  try {
    await s3().send(
      new CreateBucketCommand({
        Bucket,
        // us-east-1 must NOT send a LocationConstraint.
        ...(region === "us-east-1"
          ? {}
          : {
              CreateBucketConfiguration: {
                LocationConstraint: region as BucketLocationConstraint,
              },
            }),
      }),
    );
  } catch (e) {
    const name = (e as { name?: string })?.name;
    if (name === "BucketAlreadyOwnedByYou") {
      // race / already created by us — fine, continue to set policy
    } else if (name === "BucketAlreadyExists") {
      throw new Error(
        `S3 bucket name "${Bucket}" is already taken by another AWS account. Choose a different S3_BUCKET_NAME.`,
      );
    } else {
      throw e;
    }
  }

  // Allow public reads: clear Block Public Access, then a read-only bucket policy.
  await s3().send(
    new PutPublicAccessBlockCommand({
      Bucket,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    }),
  );
  await s3().send(
    new PutBucketPolicyCommand({
      Bucket,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Principal: "*",
            Action: "s3:GetObject",
            Resource: `arn:aws:s3:::${Bucket}/*`,
          },
        ],
      }),
    }),
  );
  ensured = true;
}

/** Upload bytes and return the public URL. */
export async function uploadImage(
  body: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  await s3().send(
    new PutObjectCommand({
      Bucket: BUCKET(),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return publicUrl(key);
}
