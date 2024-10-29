"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to SocialHub</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to connect with friends and share moments</p>
        </div>
        <div className="space-y-4">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </div>
      </Card>
    </div>
  );
}