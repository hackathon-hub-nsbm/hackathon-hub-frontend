"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/store/auth-store";
import { ConfirmDialog } from "@/components";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const getAllUsers = () => {
        api
            .get("/api/v1/user", {
                withCredentials: true,
            })
            .then((res) => {
                setUsers(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
            });
    };

    const handleDeleteClick = (userId: string) => {
        setUserToDelete(userId);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            api
                .delete(`/api/v1/user/${userToDelete}`, { withCredentials: true })
                .then(() => {
                    setUsers(users.filter((user) => user.id !== userToDelete));
                })
                .catch((err) => {
                    console.error("Error deleting user:", err);
                });
        }
        setConfirmOpen(false);
        setUserToDelete(null);
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
        setUserToDelete(null);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">User Management</h1>
                <Link href="/dashboard/users/add">
                    <Button className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                </Link>
            </div>

            <div className="mt-8">
                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="cursor-pointer">
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteClick(user.id!)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Cards */}
                <div className="flex flex-col gap-2 md:hidden">
                    {users.map((user) => (
                        <Card key={user.id}>
                            <CardContent className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={`https://avatar.iran.liara.run/username?username=${user.username}`}
                                        />
                                        <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <h2 className="font-bold">{user.username}</h2>
                                        <span className="text-xs">
                                            {user.email}{" "}
                                            <span className="text-blue-500">{user.role}</span>
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:text-red-500"
                                    onClick={() => handleDeleteClick(user.id!)}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete User"
                message="You want to delete this user?"
            />
        </div>
    );
}
