import * as React from "react"

import { NavMain } from "@/components/molecules/nav-main"
import { NavSecondary } from "@/components/molecules/nav-secondary"
import { NavUser } from "@/components/molecules/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/atoms/sidebar"
import { LayoutDashboardIcon, ChartBarIcon, Settings2Icon, CircleHelpIcon, SearchIcon, CalendarIcon, LibraryBigIcon, } from "lucide-react"
import Logo from '@/assets/logo.svg?react'

const data = {
  user: {
    name: "Lucas Torres",
    email: "eu.lucastr@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Meus concursos",
      url: "#",
      icon: (
        <LibraryBigIcon
        />
      ),
    },
    {
      title: "Estatísticas",
      url: "#",
      icon: (
        <ChartBarIcon
        />
      ),
    },
    {
      title: "Cronograma",
      url: "#",
      icon: (
        <CalendarIcon
        />
      ),
    }
  ],
  navSecondary: [
    {
      title: "Ajuda",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Pesquisa",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
    {
      title: "Configurações",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! flex justify-between"
              render={<a href="#" />}
            >
              <span className="text-base font-semibold">Mentoria</span>
              <Logo className="size-7!" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
