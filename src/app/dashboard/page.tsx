"use client";

import { useEffect, useState } from "react";
import { Users, ListChecks, Images, Activity } from "lucide-react";
import api from "@/lib/api";
import { timeAgo } from "@/lib/date-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardData } from "@/types";

export default function DashboardPage() {
    const [dashboardData, setDashBoardData] = useState<DashboardData>({});

    const fetchDashboardData = () => {
        api
            .get("/api/v1/dashboard", { withCredentials: true })
            .then((res) => {
                setDashBoardData(res.data.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Dashboard Overview</h1>
            </div>

            <div className="mt-8">
                <h2 className="font-semibold text-lg mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                        <CardContent className="flex flex-col items-center justify-center gap-3 p-5">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-600">
                                    Total Users
                                </span>
                            </div>
                            <h1 className="font-semibold text-4xl">
                                {dashboardData?.totalUsers ?? 0}
                            </h1>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                        <CardContent className="flex flex-col items-center justify-center gap-3 p-5">
                            <div className="flex items-center gap-2">
                                <ListChecks className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-600">
                                    Total Tasks
                                </span>
                            </div>
                            <h1 className="font-semibold text-4xl">
                                {dashboardData?.totalTasks ?? 0}
                            </h1>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                        <CardContent className="flex flex-col items-center justify-center gap-3 p-5">
                            <div className="flex items-center gap-2">
                                <Images className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-600">
                                    Total Posts
                                </span>
                            </div>
                            <h1 className="font-semibold text-4xl">
                                {dashboardData?.totalPosts ?? 0}
                            </h1>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold flex items-center gap-1 mb-4">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                    </h2>

                    <Card>
                        <CardContent className="p-0">
                            {dashboardData?.recentTasks?.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between border-b border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer last:border-b-0"
                                >
                                    <p className="text-sm">
                                        <b>An Admin</b> added a new task:{" "}
                                        <span className="text-blue-500">{task.title}</span>
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {timeAgo(task.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
