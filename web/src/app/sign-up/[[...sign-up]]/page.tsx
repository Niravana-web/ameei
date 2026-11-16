import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      <SignUp />
    </div>
  );
}
