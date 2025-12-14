"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/store/auth-store";

interface SubTaskForm {
    title: string;
    description: string;
    assigneeIds: string[];
    searchQuery: string;
}

export function AddTaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [subTasks, setSubTasks] = useState<SubTaskForm[]>([
        { title: "", description: "", assigneeIds: [], searchQuery: "" },
    ]);

    const getAllUsers = () => {
        api
            .get("/api/v1/user", { withCredentials: true })
            .then((res) => setUsers(res.data.data))
            .catch((err) => console.error("Error fetching users:", err));
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const toggleAssignee = (
        list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        id: string
    ) => {
        if (list.includes(id)) {
            setList(list.filter((a) => a !== id));
        } else {
            setList([...list, id]);
        }
    };

    const updateSubTask = (
        index: number,
        field: keyof SubTaskForm,
        value: string
    ) => {
        const updated = [...subTasks];
        if (field === "assigneeIds") {
            return;
        }
        updated[index][field] = value;
        setSubTasks(updated);
    };

    const toggleSubTaskAssignee = (index: number, id: string) => {
        const updated = [...subTasks];
        if (updated[index].assigneeIds.includes(id)) {
            updated[index].assigneeIds = updated[index].assigneeIds.filter(
                (a) => a !== id
            );
        } else {
            updated[index].assigneeIds.push(id);
        }
        setSubTasks(updated);
    };

    const addSubTask = () => {
        setSubTasks([
            ...subTasks,
            { title: "", description: "", assigneeIds: [], searchQuery: "" },
        ]);
    };

    const deleteSubTask = (index: number) => {
        const updated = [...subTasks];
        updated.splice(index, 1);
        setSubTasks(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { title, description, assigneeIds, subTasks };

        if (title === "" || description === "" || subTasks.length < 1) {
            toast.error("Main Task title, Description, and at least 1 subtask required.");
            return;
        }

        if (assigneeIds.length < 1) {
            toast.error("Task should have at least one assignee.");
            return;
        }

        if (subTasks[0].title === "") {
            toast.error("Subtask title is empty.");
            return;
        }

        setIsLoading(true);

        api
            .post("/api/v1/task", payload, { withCredentials: true })
            .then((res) => {
                if (res.data.success) {
                    toast.success("Task created successfully!");
                    setTitle("");
                    setDescription("");
                    setAssigneeIds([]);
                    setSubTasks([
                        { title: "", description: "", assigneeIds: [], searchQuery: "" },
                    ]);
                } else {
                    toast.error("Failed to create task: " + res.data.message);
                }
            })
            .catch((err) => {
                console.error("Error creating task:", err);
                toast.error("Error creating task.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-4 mt-8">
                <Input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                />

                <Textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                />

                <div>
                    <p className="font-medium mb-2">Assign to:</p>
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                        disabled={isLoading}
                    />
                    <div className="flex flex-wrap gap-2">
                        {users
                            .filter((u) =>
                                u.username?.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((u) => (
                                <Button
                                    key={u.id}
                                    type="button"
                                    variant={assigneeIds.includes(u.id!) ? "default" : "secondary"}
                                    size="sm"
                                    onClick={() =>
                                        toggleAssignee(assigneeIds, setAssigneeIds, u.id!)
                                    }
                                    className="flex items-center gap-1"
                                >
                                    {assigneeIds.includes(u.id!) ? (
                                        <X className="h-3 w-3" />
                                    ) : (
                                        <Plus className="h-3 w-3" />
                                    )}
                                    {u.username}
                                </Button>
                            ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="font-medium">Subtasks:</p>
                    {subTasks.map((sub, i) => (
                        <div
                            key={i}
                            className="p-3 border flex flex-col rounded space-y-2 relative"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSubTask(i)}
                                className="absolute -top-2.5 -right-2.5"
                                disabled={isLoading}
                            >
                                <XCircle className="h-6 w-6 text-gray-500 hover:text-red-500" />
                            </Button>

                            <Input
                                type="text"
                                placeholder="Subtask Title"
                                value={sub.title}
                                onChange={(e) => updateSubTask(i, "title", e.target.value)}
                                disabled={isLoading}
                            />
                            <Textarea
                                placeholder="Subtask Description"
                                value={sub.description}
                                onChange={(e) =>
                                    updateSubTask(i, "description", e.target.value)
                                }
                                disabled={isLoading}
                            />

                            <Input
                                type="text"
                                placeholder="Search sub task assignees..."
                                value={sub.searchQuery || ""}
                                onChange={(e) =>
                                    updateSubTask(i, "searchQuery", e.target.value)
                                }
                                className="mb-2"
                                disabled={isLoading}
                            />

                            <div>
                                <p className="mb-1 text-sm font-medium">Assign to:</p>
                                <div className="flex flex-wrap gap-2">
                                    {users
                                        .filter((u) => assigneeIds.includes(u.id!))
                                        .filter((u) =>
                                            u.username
                                                ?.toLowerCase()
                                                .includes((sub.searchQuery || "").toLowerCase())
                                        )
                                        .map((u) => (
                                            <Button
                                                key={u.id}
                                                type="button"
                                                variant={
                                                    sub.assigneeIds.includes(u.id!)
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                size="sm"
                                                onClick={() => toggleSubTaskAssignee(i, u.id!)}
                                                className="flex items-center gap-1"
                                            >
                                                {sub.assigneeIds.includes(u.id!) ? (
                                                    <X className="h-3 w-3" />
                                                ) : (
                                                    <Plus className="h-3 w-3" />
                                                )}
                                                {u.username}
                                            </Button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={addSubTask}
                        disabled={isLoading}
                    >
                        + Add Subtask
                    </Button>
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Create Task"
                    )}
                </Button>
            </div>
        </form>
    );
}
