"use client";

import { Search } from "lucide-react";

export function MobileTopBar() {
    return (
        <div className="fixed top-0 left-0 right-0 h-[70px] bg-primary flex md:hidden items-center">
            <div className="wrapper w-full flex items-center justify-between px-4">
                <div className="text-secondary font-bold">Hackathon Hub</div>
                <Search className="h-6 w-6 text-secondary cursor-pointer" />
            </div>
        </div>
    );
}
