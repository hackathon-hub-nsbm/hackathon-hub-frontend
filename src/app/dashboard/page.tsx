"use client";

import { useEffect, useState } from "react";
import { Users, ListChecks, CheckCircle2, Activity, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { timeAgo } from "@/lib/date-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardData } from "@/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

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

    // mock data for charts 
    const taskStatusData = [
        { status: "Completed", count: Math.floor((dashboardData?.totalTasks ?? 0) * 0.6), fill: "#10b981" },
        { status: "In Progress", count: Math.floor((dashboardData?.totalTasks ?? 0) * 0.3), fill: "#f59e0b" },
        { status: "Pending", count: Math.floor((dashboardData?.totalTasks ?? 0) * 0.1), fill: "#ef4444" },
    ];

    const weeklyActivityData = [
        { day: "Mon", tasks: 12 },
        { day: "Tue", tasks: 15 },
        { day: "Wed", tasks: 8 },
        { day: "Thu", tasks: 20 },
        { day: "Fri", tasks: 18 },
        { day: "Sat", tasks: 5 },
        { day: "Sun", tasks: 3 },
    ];

    const userGrowthData = [
        { month: "Jan", users: 45 },
        { month: "Feb", users: 52 },
        { month: "Mar", users: 61 },
        { month: "Apr", users: 73 },
        { month: "May", users: 89 },
        { month: "Jun", users: dashboardData?.totalUsers ?? 95 },
    ];

    const chartConfig = {
        tasks: {
            label: "Tasks",
            color: "#3b82f6",
        },
        users: {
            label: "Users",
            color: "#8b5cf6",
        },
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Dashboard Overview</h1>
            </div>

            <div className="mt-8">
                <h2 className="font-semibold text-lg mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
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

                    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
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

                    {/* <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
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
                    </Card> */}

                    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
                        <CardContent className="flex flex-col items-center justify-center gap-3 p-5">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-semibold text-gray-600">
                                    Completed Tasks
                                </span>
                            </div>
                            <h1 className="font-semibold text-4xl">
                                {taskStatusData[0].count}
                            </h1>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Task Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Status Distribution</CardTitle>
                            <CardDescription>Overview of task completion status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Pie
                                        data={taskStatusData}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {taskStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Weekly Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Task Activity</CardTitle>
                            <CardDescription>Tasks created this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <BarChart data={weeklyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* User Growth Trend */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                User Growth Trend
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </CardTitle>
                            <CardDescription>Monthly user registration growth</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <LineChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={{ fill: "#8b5cf6", r: 4 }}
                                    />
                                </LineChart>
                            </ChartContainer>
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
                                    className="flex items-center justify-between border-b border-gray-200 p-5 hover:shadow-md transition-shadow duration-300 cursor-pointer last:border-b-0"
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
