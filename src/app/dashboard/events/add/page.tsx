"use client";

import { AddEventForm } from "@/components";

export default function AddEventPage() {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Add New Event</h1>
            <AddEventForm />
        </div>
    );
}
