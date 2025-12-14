"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ListChecks,
    PlusSquare,
    Users,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardBottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard },
        { href: "/dashboard/tasks", icon: ListChecks },
        // { href: "/dashboard/posts/create", icon: PlusSquare },
        { href: "/dashboard/users", icon: Users },
        { href: "/dashboard/profile", icon: User },
    ];

    return (
        <div className="fixed flex md:hidden items-center bottom-0 left-0 right-0 w-full h-17.5 bg-primary z-50">
            <div className="w-full flex items-center justify-between">
                {navItems.map((item) => (
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
            </div>
        </div>
    );
}
