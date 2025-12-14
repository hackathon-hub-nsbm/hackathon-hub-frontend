"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddUserForm } from "@/components/dashboard/add-user-form";
import useAuthStore from "@/store/auth-store";

export default function AddUserPage() {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user?.role === "VOLUNTEER") {
            router.replace("/dashboard/users");
        }
    }, [user, router]);

    if (user?.role === "VOLUNTEER") {
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Add New User</h1>
            </div>
            <AddUserForm />
        </div>
    );
}
