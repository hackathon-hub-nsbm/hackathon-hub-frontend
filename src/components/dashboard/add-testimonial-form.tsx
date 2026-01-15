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

export function AddTestimonialForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        feedback: "",
    });
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("feedback", formData.feedback);
            if (image) {
                data.append("image", image);
            }

            await api.post("/api/v1/testimonial", data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Testimonial created successfully!");
            router.push("/dashboard/testimonials");
        } catch (error: any) {
            console.error("Error creating testimonial:", error);
            toast.error(
                error.response?.data?.message || "Failed to create testimonial"
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
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter name"
                            minLength={2}
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback *</Label>
                        <Textarea
                            id="feedback"
                            name="feedback"
                            value={formData.feedback}
                            onChange={handleChange}
                            required
                            placeholder="Enter feedback"
                            rows={6}
                            minLength={10}
                            maxLength={1000}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {image && (
                            <p className="text-sm text-gray-600">
                                Selected: {image.name}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/testimonials")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Testimonial"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
