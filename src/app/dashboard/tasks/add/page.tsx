"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddTaskForm } from "@/components/dashboard/add-task-form";
import useAuthStore from "@/store/auth-store";

export default function AddTaskPage() {
    const { user } = useAuthStore();
    const router = useRouter();

    const canCreateTask = user?.role === "ADMIN" || user?.role === "EDITOR";

    useEffect(() => {
        if (user && !canCreateTask) {
            router.replace("/dashboard/tasks");
        }
    }, [user, canCreateTask, router]);

    if (!canCreateTask) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Create New Task</h1>
            </div>
            <AddTaskForm />
        </div>
    );
}
