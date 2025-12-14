"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/auth-store";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    const { user } = useAuthStore();

    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        newPassword: "",
    });

    useEffect(() => {
        setErrors({ newPassword: "" });
    }, [newPassword]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword === "") {
            setErrors((prev) => ({
                ...prev,
                newPassword: "New Password is required.",
            }));
            return;
        }

        if (newPassword.length < 8) {
            setErrors((prev) => ({
                ...prev,
                newPassword: "New Password must have minimum 8 characters.",
            }));
            return;
        }

        setIsLoading(true);

        api
            .put(
                "/api/v1/auth/change-password",
                {
                    newPassword: newPassword,
                },
                { withCredentials: true }
            )
            .then(() => {
                toast.success("Password Changed Successfully.");
                setNewPassword("");
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2">
                <Avatar className="h-[50px] w-[50px]">
                    <AvatarImage
                        src={`https://avatar.iran.liara.run/username?username=${user?.username}`}
                    />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold">
                        {user?.username}{" "}
                        <span className="text-gray-400">({user?.position})</span>
                    </h1>
                    <span className="text-sm flex items-center gap-2">
                        <span>{user?.email}</span>
                        <Badge
                            variant={user?.role === "ADMIN" ? "default" : "secondary"}
                            className={
                                user?.role === "ADMIN"
                                    ? "bg-green-200 text-green-500 hover:bg-green-200"
                                    : user?.role === "VOLUNTEER"
                                        ? "bg-purple-200 text-purple-500 hover:bg-purple-200"
                                        : "bg-blue-200 text-blue-500 hover:bg-blue-200"
                            }
                        >
                            {user?.role}
                        </Badge>
                    </span>
                </div>
            </div>

            <div className="h-[0.5px] w-full bg-gray-400 my-8"></div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-1 w-full max-w-[400px]"
            >
                <Input
                    type="text"
                    placeholder="New Password"
                    name="newPassword"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    disabled={isLoading}
                />
                <span className="text-sm font-light text-red-500">
                    {errors.newPassword}
                </span>

                <Button type="submit" className="max-w-max" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Change Password"
                    )}
                </Button>
            </form>
        </div>
    );
}
