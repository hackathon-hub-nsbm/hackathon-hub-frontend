"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/dashboard/task-list";
import { Task } from "@/types";
import useAuthStore from "@/store/auth-store";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { user } = useAuthStore();

    const canCreateTask = user?.role === "ADMIN" || user?.role === "EDITOR";

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get("/api/v1/task", {
                    withCredentials: true,
                });
                setTasks(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold">Tasks Management</h1>
                {canCreateTask && (
                    <Link href="/dashboard/tasks/add">
                        <Button className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            New Task
                        </Button>
                    </Link>
                )}
            </div>

            <TaskList tasks={tasks} />
        </div>
    );
}
