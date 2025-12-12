"use client";

import { AddUserForm } from "@/components/dashboard/add-user-form";

export default function AddUserPage() {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Add New User</h1>
            </div>
            <AddUserForm />
        </div>
    );
}
