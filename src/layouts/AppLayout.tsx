import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <SidebarProvider className="bg-background text-foreground">
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-between bg-sidebar border-b border-border px-4 py-2">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}