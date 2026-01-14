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
  deadline?: string;
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

export interface Event {
  id: string;
  name: string;
  date: string;
  description?: string;
  time?: string;
  location?: string;
  registerLink?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  feedback: string;
  imageUrl: string;
}
