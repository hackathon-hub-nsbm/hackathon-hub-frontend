import { ProtectedRoute } from "@/components/protected-route";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { DashboardSideNav } from "@/components/dashboard/dashboard-side-nav";
import { DashboardBottomNav } from "@/components/dashboard/dashboard-bottom-nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="bg-secondary">
                <DashboardTopBar />
                <DashboardSideNav />
                <div className="bg-secondary min-h-screen pt-[80px] md:ml-[250px] pb-[100px] px-4">
                    {children}
                </div>
                <DashboardBottomNav />
            </div>
        </ProtectedRoute>
    );
}
