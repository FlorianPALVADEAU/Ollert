"use client"

import {
    Home,
    Settings,
    LogOut,
    SidebarIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { logout } from "@/app/login/action"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent className="h-full mt-2">
                <SidebarGroup className="h-full">
                    <SidebarGroupLabel>Ollert</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-col justify-start h-full mt-2">

                        <SidebarMenu className="!h-[90%]">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <form action={logout}>
                                    <SidebarMenuButton type="submit" className="w-full bg-red-400 text-white">
                                        <LogOut />
                                        <span>Déconnexion</span>
                                    </SidebarMenuButton>
                                </form>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
