import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      <SignIn />
    </div>
  );
}
