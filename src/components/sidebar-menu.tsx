"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "@/store/auth-store";
import {
    Compass,
    Building2,
    Trophy,
    PlusSquare,
    User,
} from "lucide-react";

export function SideBarMenu() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="p-6 hidden md:flex flex-col gap-[80px] text-secondary h-screen fixed top-0 left-0 z-50 bg-primary">
            <div className="text-xl font-bold">Hackathon Hub</div>

            <div className="flex flex-col gap-10">
                <Link href="/" className="flex items-center gap-4 cursor-pointer">
                    <Compass className="h-6 w-6" />
                    <span className="text-md font-semibold">Explore</span>
                </Link>

                <Link href="/join" className="flex items-center gap-4 cursor-pointer">
                    <Building2 className="h-6 w-6" />
                    <span className="text-md">Join With Us</span>
                </Link>

                <Link href="/leaderboard" className="flex items-center gap-4 cursor-pointer">
                    <Trophy className="h-6 w-6" />
                    <span className="text-md">Leaderboard</span>
                </Link>

                {isAuthenticated && (
                    <>
                        {/* <Link
                            href="/dashboard/posts/create"
                            className="flex items-center gap-4 cursor-pointer"
                        >
                            <PlusSquare className="h-6 w-6" />
                            <span className="text-md">Create</span>
                        </Link> */}

                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-4 cursor-pointer"
                        >
                            <User className="h-6 w-6" />
                            <span className="text-md">Profile</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
