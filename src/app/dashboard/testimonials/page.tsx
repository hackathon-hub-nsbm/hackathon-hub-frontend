"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Testimonial } from "@/types";
import useAuthStore from "@/store/auth-store";
import { EditTestimonialDialog, ConfirmDialog } from "@/components";

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
    const { user } = useAuthStore();

    const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";

    const fetchTestimonials = () => {
        api
            .get("/api/v1/testimonial", { withCredentials: true })
            .then((res) => {
                setTestimonials(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching testimonials:", err);
            });
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleEditClick = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setDialogOpen(true);
    };

    const handleTestimonialUpdated = () => {
        fetchTestimonials();
        setDialogOpen(false);
        setSelectedTestimonial(null);
    };

    const handleDeleteClick = (testimonial: Testimonial) => {
        setTestimonialToDelete(testimonial);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!testimonialToDelete) return;

        try {
            await api.delete(`/api/v1/testimonial/${testimonialToDelete.id}`, {
                withCredentials: true,
            });
            toast.success("Testimonial deleted successfully!");
            fetchTestimonials();
            setDeleteDialogOpen(false);
            setTestimonialToDelete(null);
        } catch (error: any) {
            console.error("Error deleting testimonial:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete testimonial"
            );
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold">Testimonials Management</h1>
                {canEdit && (
                    <Link href="/dashboard/testimonials/add">
                        <Button className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Add Testimonial
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
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Feedback</TableHead>
                                {canEdit && <TableHead>Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.map((testimonial) => (
                                <TableRow key={testimonial.id} className="cursor-pointer">
                                    <TableCell>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={testimonial.imageUrl} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {testimonial.feedback}
                                    </TableCell>
                                    {canEdit && (
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditClick(testimonial)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(testimonial)}
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
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.id}>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={testimonial.imageUrl} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{testimonial.name}</span>
                                    </div>
                                    {canEdit && (
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(testimonial)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteClick(testimonial)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">{testimonial.feedback}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {selectedTestimonial && (
                <EditTestimonialDialog
                    testimonial={selectedTestimonial}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSuccess={handleTestimonialUpdated}
                />
            )}

            <ConfirmDialog
                open={deleteDialogOpen}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Testimonial"
                message={`Are you sure you want to delete the testimonial from "${testimonialToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}
