"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Testimonial } from "@/types";

interface EditTestimonialDialogProps {
    testimonial: Testimonial;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditTestimonialDialog({
    testimonial,
    open,
    onClose,
    onSuccess,
}: EditTestimonialDialogProps) {
    const [name, setName] = useState(testimonial.name);
    const [feedback, setFeedback] = useState(testimonial.feedback);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(testimonial.imageUrl);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(testimonial.name);
        setFeedback(testimonial.feedback);
        setPreview(testimonial.imageUrl);
        setImage(null);
    }, [testimonial]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !feedback) {
            toast.error("Name and feedback are required.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("feedback", feedback);
        if (image) {
            formData.append("image", image);
        }

        try {
            await api.put(`/api/v1/testimonial/${testimonial.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            toast.success("Testimonial updated successfully!");
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update testimonial.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">Edit Testimonial</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Name *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Person's name"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Feedback *</label>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Testimonial feedback"
                            disabled={isLoading}
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Image</label>
                        <div className="mt-2 space-y-2">
                            {preview && (
                                <div className="flex justify-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-32 w-32 rounded-full object-cover"
                                    />
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="w-full"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {image ? "Change Image" : "Upload New Image"}
                            </Button>
                        </div>
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
                                "Update Testimonial"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
