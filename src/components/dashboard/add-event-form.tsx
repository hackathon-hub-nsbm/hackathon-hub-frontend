"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function AddEventForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        description: "",
        time: "",
        location: "",
        registerLink: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/api/v1/event", formData, {
                withCredentials: true,
            });
            toast.success("Event created successfully!");
            router.push("/dashboard/events");
        } catch (error: any) {
            console.error("Error creating event:", error);
            toast.error(
                error.response?.data?.message || "Failed to create event"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Event Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter event name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                            id="time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="e.g., 10:00 AM"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter event location"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter event description"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="registerLink">Registration Link</Label>
                        <Input
                            id="registerLink"
                            name="registerLink"
                            type="url"
                            value={formData.registerLink}
                            onChange={handleChange}
                            placeholder="https://example.com/register"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/events")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Event"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
