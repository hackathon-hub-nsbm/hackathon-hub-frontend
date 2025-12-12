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

export function DashboardSideNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/dashboard/tasks", icon: ListChecks, label: "Tasks" },
        { href: "/dashboard/posts/create", icon: PlusSquare, label: "Create Post" },
        { href: "/dashboard/users", icon: Users, label: "Users" },
        { href: "/dashboard/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="fixed top-[70px] min-w-[250px] left-0 h-screen bg-secondary shadow-sm border-r border-gray-200 z-40 hidden md:block">
            <div className="p-3 flex flex-col gap-3">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        className={cn(
                            "flex items-center w-full hover:bg-gray-200 p-3 gap-3 rounded-md text-sm transition-all",
                            isActive(item.href) || (item.href === "/dashboard/users" && pathname === "/dashboard/users/add")
                                ? "font-semibold scale-102 bg-gray-200"
                                : "opacity-70"
                        )}
                        href={item.href}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
