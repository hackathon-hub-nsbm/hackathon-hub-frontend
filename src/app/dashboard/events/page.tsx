"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Event } from "@/types";
import useAuthStore from "@/store/auth-store";
import { EditEventDialog, ConfirmDialog } from "@/components";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const { user } = useAuthStore();

    const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";

    const fetchEvents = () => {
        api
            .get("/api/v1/event", { withCredentials: true })
            .then((res) => {
                setEvents(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setDialogOpen(true);
    };

    const handleEventUpdated = () => {
        fetchEvents();
        setDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleDeleteClick = (event: Event) => {
        setEventToDelete(event);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!eventToDelete) return;

        try {
            await api.delete(`/api/v1/event/${eventToDelete.id}`, {
                withCredentials: true,
            });
            toast.success("Event deleted successfully!");
            fetchEvents();
            setDeleteDialogOpen(false);
            setEventToDelete(null);
        } catch (error: any) {
            console.error("Error deleting event:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete event"
            );
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold">Events Management</h1>
                {canEdit && (
                    <Link href="/dashboard/events/add">
                        <Button className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Add Event
                        </Button>
                    </Link>
                )}
            </div>

            <div className="mt-8">
                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Location</TableHead>
                                {canEdit && <TableHead>Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id} className="cursor-pointer">
                                    <TableCell className="font-medium">{event.name}</TableCell>
                                    <TableCell>{event.date}</TableCell>
                                    <TableCell>{event.time || "N/A"}</TableCell>
                                    <TableCell>{event.location || "N/A"}</TableCell>
                                    {canEdit && (
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditClick(event)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(event)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Cards */}
                <div className="flex flex-col gap-4 md:hidden">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between">
                                    {event.name}
                                    {canEdit && (
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(event)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteClick(event)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm">
                                    <span className="font-semibold">Date:</span> {event.date}
                                </p>
                                {event.time && (
                                    <p className="text-sm">
                                        <span className="font-semibold">Time:</span> {event.time}
                                    </p>
                                )}
                                {event.location && (
                                    <p className="text-sm">
                                        <span className="font-semibold">Location:</span>{" "}
                                        {event.location}
                                    </p>
                                )}
                                {event.description && (
                                    <p className="text-sm text-gray-600">{event.description}</p>
                                )}
                                {event.registerLink && (
                                    <a
                                        href={event.registerLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Register Here
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {selectedEvent && (
                <EditEventDialog
                    event={selectedEvent}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSuccess={handleEventUpdated}
                />
            )}

            <ConfirmDialog
                open={deleteDialogOpen}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Event"
                message={`Are you sure you want to delete "${eventToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
