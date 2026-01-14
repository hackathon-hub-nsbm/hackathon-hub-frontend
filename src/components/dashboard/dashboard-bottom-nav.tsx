"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ListChecks,
    Images,
    Users,
    User,
    Calendar,
    MessageSquare,
    MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function DashboardBottomNav() {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);

    const isActive = (path: string) => pathname === path;

    const primaryNavItems = [
        { href: "/dashboard", icon: LayoutDashboard },
        { href: "/dashboard/tasks", icon: ListChecks },
        { href: "/dashboard/posts", icon: Images },
        { href: "/dashboard/users", icon: Users },
    ];

    const moreNavItems = [
        { href: "/dashboard/events", icon: Calendar, label: "Events" },
        { href: "/dashboard/testimonials", icon: MessageSquare, label: "Testimonials" },
        { href: "/dashboard/profile", icon: User, label: "Profile" },
    ];

    return (
        <>
            {showMore && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setShowMore(false)}
                >
                    <div className="absolute bottom-17.5 left-0 right-0 bg-white shadow-lg">
                        {moreNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 p-4 border-b hover:bg-gray-50",
                                    isActive(item.href) ? "bg-blue-50 font-semibold" : ""
                                )}
                                onClick={() => setShowMore(false)}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="fixed flex md:hidden items-center bottom-0 left-0 right-0 w-full h-17.5 bg-primary z-50">
                <div className="w-full flex items-center justify-between">
                    {primaryNavItems.map((item) => (
                        <Link
                            key={item.href}
                            className={cn(
                                "flex justify-center items-center text-secondary w-full transition-all",
                                isActive(item.href) || (item.href === "/dashboard/users" && pathname === "/dashboard/users/add")
                                    ? "font-semibold scale-110"
                                    : "opacity-70"
                            )}
                            href={item.href}
                        >
                            <item.icon className="h-6 w-6" />
                        </Link>
                    ))}
                    <button
                        className={cn(
                            "flex justify-center items-center text-secondary w-full transition-all",
                            moreNavItems.some((item) => isActive(item.href))
                                ? "font-semibold scale-110"
                                : "opacity-70"
                        )}
                        onClick={() => setShowMore(!showMore)}
                    >
                        <MoreHorizontal className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </>
    );
}
