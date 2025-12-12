"use client";

import { AddTaskForm } from "@/components/dashboard/add-task-form";

export default function AddTaskPage() {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Create New Task</h1>
            </div>
            <AddTaskForm />
        </div>
    );
}
