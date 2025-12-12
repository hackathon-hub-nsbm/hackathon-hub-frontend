"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CreatePostForm() {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text && !image) return alert("Please add a caption or image.");

        const formData = new FormData();
        formData.append("caption", text);
        if (image) formData.append("image", image);

        setLoading(true);

        try {
            const response = await api.post("/api/v1/post/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.data.success) {
                alert("Post created successfully!");
                setText("");
                removeImage();
            } else {
                alert("Failed to create post: " + response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error creating post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:max-w-4xl mx-auto bg-white md:shadow overflow-hidden md:p-4 md:rounded-md">
            <div className="flex items-center justify-between border-b border-gray-300 p-4 mb-4">
                <X className="h-5 w-5 cursor-pointer" />
                <span className="font-semibold">Create Post</span>
                <Button
                    variant="ghost"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="font-semibold text-primary"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
                </Button>
            </div>

            <div className="flex flex-col gap-4 mb-4 px-4">
                <Textarea
                    ref={textareaRef}
                    className="w-full focus:outline-none bg-transparent resize-none text-sm border-none"
                    rows={5}
                    placeholder="Write something....."
                    value={text}
                    onChange={handleTextChange}
                />
            </div>

            {preview ? (
                <div className="relative w-full md:rounded overflow-hidden mb-4">
                    <img src={preview} alt="Preview" className="w-full h-auto rounded" />
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="px-4 mb-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-2xl text-primary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className="h-6 w-6" />
                    </Button>
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
            />
        </div>
    );
}
