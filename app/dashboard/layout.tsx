import Appbar from "@/components/molecules/dashboard.appbar";
import DasshboardSidebar from "@/components/molecules/dashboard.sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB] dark:bg-[#0F0F0F] text-gray-900 dark:text-gray-100">
      <DasshboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Appbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
