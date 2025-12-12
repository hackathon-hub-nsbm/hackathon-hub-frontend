"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/auth-store";
import api from "@/lib/api";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { setIsAuthenticated, setUser, setAuthLoading } = useAuthStore();

    useEffect(() => {
        api
            .post("/api/v1/auth/check-auth", {}, { withCredentials: true })
            .then((res) => {
                setUser(res.data.data);
                setIsAuthenticated(true);
            })
            .catch(() => {
                setUser(null);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setAuthLoading(false);
            });
    }, [setIsAuthenticated, setUser, setAuthLoading]);

    return <>{children}</>;
}
