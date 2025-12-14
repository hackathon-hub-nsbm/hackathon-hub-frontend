"use client";

import { Search } from "lucide-react";
import useAuthStore from "@/store/auth-store";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function DashboardTopBar() {
    const { user, setUser, setIsAuthenticated } = useAuthStore();

    const logout = () => {
        api
            .post("/api/v1/auth/logout", {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                setIsAuthenticated(false);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="fixed top-0 left-0 right-0 bg-secondary w-full h-17.5 flex items-center border-b shadow-sm border-gray-200 z-40">
            <div className="w-full flex items-center justify-between px-4">
                <div className="font-bold text-lg">Hackathon Hub</div>

                <div className="flex items-center gap-4">
                    <Input
                        type="search"
                        placeholder="Search"
                        className="hidden md:block w-64"
                    />

                    <Search className="h-5 w-5 block md:hidden cursor-pointer" />

                    <Button variant="secondary" className="hidden md:block cursor-pointer" onClick={logout}>
                        Logout
                    </Button>

                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={`https://avatar.iran.liara.run/username?username=${user?.username}`}
                            alt={user?.username}
                        />
                        <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
