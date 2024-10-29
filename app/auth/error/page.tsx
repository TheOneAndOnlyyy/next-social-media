import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Authentication Error</h2>
        <p className="mt-2 text-gray-600">There was a problem signing you in.</p>
        <Link 
          href="/auth/signin"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Try again
        </Link>
      </Card>
    </div>
  );
}