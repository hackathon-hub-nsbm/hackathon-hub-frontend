"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Event } from "@/types";

interface EditEventDialogProps {
    event: Event;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditEventDialog({
    event,
    open,
    onClose,
    onSuccess,
}: EditEventDialogProps) {
    const [name, setName] = useState(event.name);
    const [date, setDate] = useState(event.date);
    const [time, setTime] = useState(event.time || "");
    const [location, setLocation] = useState(event.location || "");
    const [description, setDescription] = useState(event.description || "");
    const [registerLink, setRegisterLink] = useState(event.registerLink || "");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setName(event.name);
        setDate(event.date);
        setTime(event.time || "");
        setLocation(event.location || "");
        setDescription(event.description || "");
        setRegisterLink(event.registerLink || "");
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !date) {
            toast.error("Event name and date are required.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("date", date);
        if (description) formData.append("description", description);
        if (time) formData.append("time", time);
        if (location) formData.append("location", location);
        if (registerLink) formData.append("registerLink", registerLink);

        try {
            await api.put(`/api/v1/event/${event.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            toast.success("Event updated successfully!");
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update event.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">Edit Event</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Event Name *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Event name"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Date *</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Event location"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Event description"
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Registration Link</label>
                        <Input
                            type="url"
                            value={registerLink}
                            onChange={(e) => setRegisterLink(e.target.value)}
                            placeholder="https://..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Update Event"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
