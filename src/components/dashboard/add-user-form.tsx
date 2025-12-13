"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { isValidEmail } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";



import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddUserFormProps {
    onSuccess?: () => void;
}

export function AddUserForm({ onSuccess }: AddUserFormProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [position, setPosition] = useState("");
    const [err, setErr] = useState("");
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "",
        position: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const checkEmail = async () => {
        setErrors((prev) => ({
            ...prev,
            email: !isValidEmail(email) ? "Enter a valid email" : "",
        }));
    };

    useEffect(() => {
        setErrors({
            fullName: "",
            email: "",
            password: "",
            role: "",
            position: "",
        });
        const timeout = setTimeout(() => {
            if (email) {
                checkEmail();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [email]);

    useEffect(() => {
        setErrors({
            fullName: "",
            email: "",
            password: "",
            role: "",
            position: "",
        });
    }, [password, fullName, role, position]);

    const resetForm = () => {
        setFullName("");
        setEmail("");
        setPassword("");
        setRole("");
        setPosition("");
        setErr("");
        setErrors({
            fullName: "",
            email: "",
            password: "",
            role: "",
            position: "",
        });
    };

    const addUser = async () => {
        try {
            setIsLoading(true);
            await api.post(
                "/api/v1/auth/add-user",
                {
                    username: fullName,
                    email: email,
                    password: password,
                    role: role,
                    position: position,
                },
                {
                    withCredentials: true,
                }
            );
            setIsLoading(false);
            toast.success("User added successfully");
            resetForm();
            onSuccess?.();
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

        if (fullName.length < 1) {
            setErrors((prev) => ({
                ...prev,
                fullName: "Full Name is required",
            }));
            return;
        }

        if (position.length < 1) {
            setErrors((prev) => ({
                ...prev,
                position: "Position is required",
            }));
            return;
        }

        if (role.length < 1) {
            setErrors((prev) => ({
                ...prev,
                role: "Role is required",
            }));
            return;
        }

        addUser();
    };

    return (
        <form
            className="flex flex-col gap-4 w-full max-w-[400px] mt-8"
            onSubmit={handleSubmit}
        >
            {err && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{err}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-1">
                <Input
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                    disabled={isLoading}
                />
                <span className="text-sm font-light text-red-500">
                    {errors.fullName}
                </span>
            </div>

            <div className="flex flex-col gap-1">
                <Input
                    type="text"
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

            <div className="flex flex-col gap-1">
                <Select onValueChange={setPosition} disabled={isLoading}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="President">President</SelectItem>
                        <SelectItem value="Vice President">Vice President</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm font-light text-red-500">
                    {errors.position}
                </span>
            </div>

            <div className="flex flex-col gap-1">
                <Select onValueChange={setRole} disabled={isLoading}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="EDITOR">Editor</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm font-light text-red-500">{errors.role}</span>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add User"}
            </Button>
        </form>
    );
}
