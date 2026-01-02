"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { IconType } from "react-icons";
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon|IconType
    visibility?: boolean
  }[]
}) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/")
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
       
        <SidebarMenu>
          {items.map((item) => 
            !item.visibility ? null : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={isActive(item.url) ? " bg-gradient-to-r from-[#FFFFFF] via-[#ADD3FF] to-[#88BFFF] border-l-5 border-blue-300 text-accent-foreground text-[#1A7FDE] " : ""}
              >
                <Link href={item.url} className="h-full  rounded-none pl-8 ">
                  {item.icon && <item.icon className="size-[25px]"/>} 
                  <span className={isActive(item.url) ? " font-semibold text-base text-red " : "font-normal text-base text-"}>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
