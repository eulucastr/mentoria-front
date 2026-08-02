import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/molecules/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/atoms/sidebar';
import { SiteHeader } from '@/components/molecules/site-header';

export function AppLayout() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-background text-foreground">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Outlet />
        </SidebarInset>
    </SidebarProvider>
    </div>
  );
}