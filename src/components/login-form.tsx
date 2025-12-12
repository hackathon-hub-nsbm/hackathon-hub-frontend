"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import useAuthStore from "@/store/auth-store";
import api from "@/lib/api";
import { isValidEmail } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
    const { setIsAuthenticated, setUser } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const checkEmail = async () => {
        setErrors((prev) => ({
            ...prev,
            email: !isValidEmail(email) ? "Enter a valid email" : "",
        }));
    };

    useEffect(() => {
        setErr("");
        const timeout = setTimeout(() => {
            if (email) {
                checkEmail();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [email]);

    useEffect(() => {
        setErr("");
    }, [password]);

    const signIn = async () => {
        try {
            setIsLoading(true);
            const res = await api.post(
                "/api/v1/auth/signin",
                {
                    email: email,
                    password: password,
                },
                {
                    withCredentials: true,
                }
            );
            setIsLoading(false);
            setIsAuthenticated(true);
            setUser(res.data.data);
            const redirectTo = searchParams.get("redirect") || "/dashboard";
            router.replace(redirectTo);
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            setErr(axiosError.response?.data?.message || "An error occurred");
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        checkEmail();
        if (password.length < 1) {
            setErrors((prev) => ({
                ...prev,
                password: "Password is required",
            }));
            return;
        }

        signIn();
    };

    return (
        <form
            className="flex flex-col gap-4 w-full max-w-[400px] px-3"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-medium">
                    Welcome ! <br />
                </h1>
                <span className="font-light text-sm">
                    Login to Hackathon Hub Platform
                </span>
                {err && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{err}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={isLoading}
                />
                <span className="text-sm font-light text-red-500">{errors.email}</span>
            </div>

            <div className="flex flex-col gap-1">
                <Input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    disabled={isLoading}
                />
                <span className="text-sm font-light text-red-500">
                    {errors.password}
                </span>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
            </Button>
        </form>
    );
}
