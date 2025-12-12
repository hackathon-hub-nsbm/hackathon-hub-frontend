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
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed flex md:hidden items-center bottom-0 left-0 right-0 w-full h-[70px] bg-primary z-50">
            <div className="w-full flex items-center justify-between">
                <Link
                    className={cn(
                        "flex justify-center items-center text-secondary w-full transition-all",
                        isActive("/") ? "font-semibold scale-110" : "opacity-70"
                    )}
                    href="/"
                >
                    <Compass className="h-6 w-6" />
                </Link>
            </div>

            <div className="w-full flex items-center justify-between">
                <Link
                    className={cn(
                        "flex justify-center items-center text-secondary w-full transition-all",
                        isActive("/join") ? "font-semibold scale-110" : "opacity-70"
                    )}
                    href="/join"
                >
                    <Building2 className="h-6 w-6" />
                </Link>
            </div>

            {isAuthenticated && (
                <div className="w-full flex items-center justify-between">
                    <Link
                        className={cn(
                            "flex justify-center items-center text-secondary w-full transition-all",
                            isActive("/dashboard/posts/create")
                                ? "font-semibold scale-110"
                                : "opacity-70"
                        )}
                        href="/dashboard/posts/create"
                    >
                        <PlusSquare className="h-6 w-6" />
                    </Link>
                </div>
            )}

            <div className="w-full flex items-center justify-between">
                <Link
                    className={cn(
                        "flex justify-center items-center text-secondary w-full transition-all",
                        isActive("/leaderboard") ? "font-semibold scale-110" : "opacity-70"
                    )}
                    href="/leaderboard"
                >
                    <Trophy className="h-6 w-6" />
                </Link>
            </div>

            {isAuthenticated && (
                <div className="w-full flex items-center justify-between">
                    <Link
                        className={cn(
                            "flex justify-center items-center text-secondary w-full transition-all",
                            isActive("/dashboard/profile")
                                ? "font-semibold scale-110"
                                : "opacity-70"
                        )}
                        href="/dashboard/profile"
                    >
                        <User className="h-6 w-6" />
                    </Link>
                </div>
            )}
        </div>
    );
}
