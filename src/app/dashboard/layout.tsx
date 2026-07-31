import { requireSession }         from "@/lib/session";
import { DashboardSidebar }       from "@/components/dashboard/sidebar";
import { DashboardHeader }        from "@/components/dashboard/dashboard-header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const { name, email, role } = session.user;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar — fixed height, scrollable nav */}
      <DashboardSidebar
        userRole={role}
        userName={name ?? "Pengguna"}
        userEmail={email ?? ""}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          title="Dashboard"
          userName={name ?? "Pengguna"}
          userRole={role}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
