import { User } from "@/store/auth-store";

export interface Post {
  id: string;
  caption: string;
  imagePath: string;
  createdAt: string;
  createdBy: User;
}

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  subTaskAssignees?: User[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  subTasks: SubTask[];
  taskAssignees?: User[];
}

export interface DashboardData {
  totalUsers?: number;
  totalTasks?: number;
  totalPosts?: number;
  recentTasks?: Task[];
}
