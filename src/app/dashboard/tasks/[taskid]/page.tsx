"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/types";

export default function TaskPage() {
    const params = useParams();
    const taskId = params.taskid as string;
    const [task, setTask] = useState<Task | null>(null);

    const fetchTask = () => {
        api
            .get(`/api/v1/task/${taskId}`, {
                withCredentials: true,
            })
            .then((res) => setTask(res.data.data))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    if (!task) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    const completeSubtask = (taskId: string, subtaskId: string) => {
        const userConfirmed = window.confirm(
            "Do you want to mark this sub task as complete?"
        );

        if (userConfirmed) {
            api
                .put(
                    `/api/v1/task/${taskId}/subtasks/${subtaskId}/complete`,
                    {},
                    { withCredentials: true }
                )
                .then(() => {
                    fetchTask();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Main Task */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{task.title}</h1>
                        <Badge variant={task.completed ? "default" : "secondary"}>
                            {task.completed ? "Completed" : "In Progress"}
                        </Badge>
                    </div>
                    {task.description && (
                        <p className="mt-3 text-gray-600">{task.description}</p>
                    )}
                </CardContent>
            </Card>

            {/* Main Task Assignees */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-lg">Assignees</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 flex-wrap">
                        {task.taskAssignees?.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
                            >
                                <Avatar className="h-10 w-10 bg-blue-500 text-white">
                                    <AvatarFallback className="bg-blue-500 text-white">
                                        {user.username?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Subtasks */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-lg">Subtasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {task.subTasks?.map((subtask) => (
                        <div
                            key={subtask.id}
                            className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <p
                                    className={`font-medium ${subtask.completed ? "line-through text-gray-500" : ""
                                        }`}
                                >
                                    {subtask.title}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge variant={subtask.completed ? "default" : "secondary"}>
                                        {subtask.completed ? "Done" : "Pending"}
                                    </Badge>
                                    {!subtask.completed && (
                                        <Button
                                            size="sm"
                                            onClick={() => completeSubtask(task.id, subtask.id)}
                                        >
                                            Mark as completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {subtask.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {subtask.description}
                                </p>
                            )}

                            {/* Subtask Assignees */}
                            {subtask.subTaskAssignees && subtask.subTaskAssignees.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm font-medium mb-1">Assignees:</p>
                                    <div className="flex gap-3 flex-wrap">
                                        {subtask.subTaskAssignees.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 border shadow-sm"
                                            >
                                                <Avatar className="h-8 w-8 bg-purple-500 text-white">
                                                    <AvatarFallback className="bg-purple-500 text-white text-sm">
                                                        {user.username?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="text-sm">{user.username}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
