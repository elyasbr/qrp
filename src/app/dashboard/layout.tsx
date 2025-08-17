import Sidebar from "@/components/dashboard/Sidebar";
import AuthGuard from "@/components/common/AuthGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-[var(--background)]">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </AuthGuard>
  );
}
