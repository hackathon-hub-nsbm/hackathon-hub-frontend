"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { Loader2 } from "lucide-react";

function LoginContent() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <LoginForm />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
