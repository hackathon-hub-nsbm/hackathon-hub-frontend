"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/types";

interface EditPostDialogProps {
    post: Post;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditPostDialog({
    post,
    open,
    onClose,
    onSuccess,
}: EditPostDialogProps) {
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState(post.caption || "");
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        setCaption(post.caption || "");
        setImage(null);
    }, [post]);

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
            data.append("caption", caption);
            if (image) {
                data.append("image", image);
            }

            await api.put(`/api/v1/post/${post.id}`, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Post updated successfully!");
            onSuccess();
        } catch (error: any) {
            console.error("Error updating post:", error);
            toast.error(
                error.response?.data?.message || "Failed to update post"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Post</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="caption">Caption *</Label>
                        <Textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            required
                            placeholder="Enter caption"
                            rows={4}
                            minLength={1}
                            maxLength={500}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Update Image (optional)</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {image && (
                            <p className="text-sm text-gray-600">
                                Selected: {image.name}
                            </p>
                        )}
                        {!image && post.imagePath && (
                            <p className="text-sm text-gray-500">
                                Current image will be kept if no new image is selected
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Post"}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
