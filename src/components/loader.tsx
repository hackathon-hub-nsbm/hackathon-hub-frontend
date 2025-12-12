"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
    isLoading: boolean;
}

export function Loader({ isLoading }: LoaderProps) {
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        </div>
    );
}
