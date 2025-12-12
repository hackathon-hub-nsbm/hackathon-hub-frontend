"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import api from "@/lib/api";
import { timeAgo } from "@/lib/date-utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Post } from "@/types";

interface PostItemProps {
    post: Post;
}

function PostItem({ post }: PostItemProps) {
    return (
        <div>
            <div className="flex flex-col gap-3 w-full md:w-[550px] max-w-[550px]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-[45px] w-[45px]">
                            <AvatarImage
                                src={`https://avatar.iran.liara.run/username?username=${post.createdBy.username}`}
                                alt={post.createdBy.username}
                            />
                            <AvatarFallback>{post.createdBy.username?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <div className="flex gap-2">
                                <span className="font-bold">{post.createdBy.username}</span>
                                <span className="text-gray-600">
                                    • {timeAgo(post.createdAt)}
                                </span>
                            </div>
                            <span className="text-sm text-gray-600">
                                {post.createdBy.position}
                            </span>
                        </div>
                    </div>
                    <MoreHorizontal className="h-5 w-5 cursor-pointer" />
                </div>

                <div className="w-full rounded-md">
                    <div>
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${post.imagePath}`}
                            alt=""
                            className="w-full rounded-md"
                        />
                    </div>
                </div>

                <p className="text-sm">
                    {post.caption}
                    <span className="text-gray-300 text-sm cursor-pointer">more</span>
                </p>
            </div>
            <div className="w-full h-[0.4px] bg-gray-600 my-10"></div>
        </div>
    );
}

export function PostsSection() {
    const [posts, setPosts] = useState<Post[]>([]);

    const getAllPosts = () => {
        api
            .get("/api/v1/post", { withCredentials: true })
            .then((res) => {
                setPosts(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    return (
        <div className="w-full p-4 flex flex-col items-center">
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
}
