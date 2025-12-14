"use client";

import Link from "next/link";
import { Plus, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/types";
import { truncateStr } from "@/lib/date-utils";
import useAuthStore from "@/store/auth-store";

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const { user } = useAuthStore();
    const completedSubtasks = task.subTasks.filter((s) => s.completed).length;
    const allSubtasksCompleted =
        task.subTasks.length > 0 && completedSubtasks === task.subTasks.length;

    const assignees = task.taskAssignees ?? [];
    const isAssignedToCurrentUser = assignees.some(
        (assignee) => assignee.id === user?.id
    );

    return (
        <Link href={`/dashboard/tasks/${task.id}`}>
            <Card className={`hover:shadow-md transition-shadow duration-300 cursor-pointer group h-50 ${isAssignedToCurrentUser ? "border-2 border-blue-500 bg-blue-50" : ""}`}>
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300">
                                {truncateStr(task.title, 25)}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {task.subTasks.length} Subtask
                                {task.subTasks.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {task.completed || allSubtasksCompleted ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                                <Clock className="h-6 w-6 text-yellow-500" />
                            )}
                        </div>
                    </div>

                    {assignees.length > 0 && (
                        <div className="flex items-center mt-3 -space-x-2 flex-wrap">
                            {assignees.map((assignee) => (
                                <Avatar
                                    key={assignee.id}
                                    className="h-7 w-7 border-2 border-white"
                                >
                                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                        {assignee.username
                                            ?.substring(0, 2)
                                            .toUpperCase() ?? "?"}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    )}

                    {task.subTasks.length > 0 && (
                        <div className="mt-4">
                            <div className="bg-gray-200 rounded-full h-2 w-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(completedSubtasks / task.subTasks.length) * 100}%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {completedSubtasks}/{task.subTasks.length} Subtasks Completed
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}

interface TaskListProps {
    tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
    const { user } = useAuthStore();
    const canCreateTask = user?.role === "ADMIN" || user?.role === "EDITOR";

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
            {canCreateTask && (
                <Link href="/dashboard/tasks/add">
                    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer group h-full flex items-center justify-center min-h-30">
                        <CardContent className="flex items-center justify-center p-5">
                            <Plus className="h-10 w-10 text-gray-300" />
                        </CardContent>
                    </Card>
                </Link>
            )}
        </div>
    );
}
