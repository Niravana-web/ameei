import type { NextConfig } from "next";

// Allow the storefront <Image> to load product photos from our S3 bucket.
// Concrete host from env when available; otherwise any S3 host as a fallback.
const s3Host =
  process.env.S3_BUCKET_NAME && process.env.AWS_REGION
    ? `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
    : "*.s3.*.amazonaws.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: s3Host }],
    formats: ["image/avif", "image/webp"],
  },
  // ponytail: baseline-only headers. Skipped CSP — this app loads Clerk, Stripe,
  // and GTM scripts; a wrong CSP silently breaks auth/checkout. Add CSP once
  // every third-party script origin is enumerated and tested.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
