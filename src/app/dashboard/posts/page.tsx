"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Post } from "@/types";
import { timeAgo } from "@/lib/date-utils";
import useAuthStore from "@/store/auth-store";
import { EditPostDialog, ConfirmDialog } from "@/components";

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const { user } = useAuthStore();

    const canCreatePost = user?.role === "ADMIN" || user?.role === "EDITOR";

    const fetchPosts = () => {
        api
            .get("/api/v1/post", { withCredentials: true })
            .then((res) => {
                setPosts(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching posts:", err);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleEditClick = (post: Post) => {
        setSelectedPost(post);
        setEditDialogOpen(true);
    };

    const handlePostUpdated = () => {
        fetchPosts();
        setEditDialogOpen(false);
        setSelectedPost(null);
    };

    const handleDeleteClick = (post: Post) => {
        setPostToDelete(post);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!postToDelete) return;

        try {
            await api.delete(`/api/v1/post/${postToDelete.id}`, {
                withCredentials: true,
            });
            toast.success("Post deleted successfully!");
            fetchPosts();
            setDeleteDialogOpen(false);
            setPostToDelete(null);
        } catch (error: any) {
            console.error("Error deleting post:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete post"
            );
        }
    };

    const canEditPost = (post: Post) => {
        return user?.id === post.createdBy.id || user?.role === "ADMIN";
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold">Posts</h1>
                {canCreatePost && (
                    <Link href="/dashboard/posts/create">
                        <Button className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Create Post
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={`https://avatar.iran.liara.run/username?username=${post.createdBy.username}`}
                                        />
                                        <AvatarFallback>
                                            {post.createdBy.username?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">
                                            {post.createdBy.username || "Unknown"}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {timeAgo(post.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                {canEditPost(post) && (
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditClick(post)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteClick(post)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {post.imagePath && (
                                <img
                                    src={post.imagePath}
                                    alt="Post"
                                    className="w-full h-64 object-cover"
                                />
                            )}
                            {post.caption && (
                                <p className="p-4 text-sm">{post.caption}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No posts yet.</p>
                    {canCreatePost && (
                        <Link href="/dashboard/posts/create">
                            <Button variant="outline" className="mt-4">
                                Create your first post
                            </Button>
                        </Link>
                    )}
                </div>
            )}

            {selectedPost && (
                <EditPostDialog
                    post={selectedPost}
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    onSuccess={handlePostUpdated}
                />
            )}

            <ConfirmDialog
                open={deleteDialogOpen}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
            />
        </div>
    );
}
