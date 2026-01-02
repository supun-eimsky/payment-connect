"use client";

import React, { useEffect, useState } from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconTicket,
  IconBusFilled,
  IconLicense,
  IconCamper,
  IconBusStop
} from "@tabler/icons-react";
import { RiBusLine } from "react-icons/ri";
import { BsCursor } from "react-icons/bs";
import { RiUserLine } from "react-icons/ri";
import { TbRouteSquare } from "react-icons/tb";
import { PiBuildingOffice } from "react-icons/pi";
import { RiBarChartBoxLine } from "react-icons/ri";
import { MdOnDeviceTraining } from "react-icons/md";
import { SlOrganization } from "react-icons/sl";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 👇 default user
  const [user, setUser] = useState({
    name: "Mina Shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  });
  const [Organisation_ID, setOrganisationId] = useState<string | null>(null);
  const [COMPANY_ID, setCompanyId] = useState<string | null>(null);

  // 👇 safely get localStorage data in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          const orgId = parsed.organisation_id || null;
          const compId = parsed.company_id || null;
          setOrganisationId(orgId);
          setCompanyId(compId);
          setUser({
            name: parsed.full_name || "Mina Shadcn",
            email: parsed.email || "m@example.com",
            avatar: parsed.avatar || "/avatars/shadcn.jpg",
          });
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
        }
      }
    }
  }, []);

  const data = {
    user,
    navMain: [
      { title: "Overview", url: "/dashboard", icon: RiBarChartBoxLine, visibility: true },
      { title: "Ticket Details", url: "/ticket-details", icon: IconTicket, visibility: true },
      { title: "Session View", url: "/session-view", icon: BsCursor, visibility: true },
      { title: "User Management", url: "/users", icon: RiUserLine, visibility: true },
      { title: "Bus Management", url: "/bus-management", icon: RiBusLine, visibility: true },
      { title: "Permits Management", url: "/route-permits", icon: IconLicense, visibility: true },
      { title: "Bus Stop Management", url: "/bus-stop", icon: IconBusStop, visibility: true },
      { title: "Route Management", url: "/route", icon: TbRouteSquare, visibility: true },
      { title: "Company Management", url: "/company", icon: PiBuildingOffice, visibility: COMPANY_ID ? false : true },
      { title: "Devices  Management", url: "/devices", icon: MdOnDeviceTraining, visibility: true },
      { title: "Organisation  Management", url: "/organisation", icon: SlOrganization, visibility: Organisation_ID || COMPANY_ID ? false : true },


    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "/capture",
        items: [
          { title: "Active Proposals", url: "/capture/active" },
          { title: "Archived", url: "/capture/archived" },
        ],
      },
    ],
    navSecondary: [
      { title: "Settings", url: "/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelp },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
    documents: [
      { name: "Data Library", url: "/documents/data-library", icon: IconDatabase },
      { name: "Reports", url: "/documents/reports", icon: IconReport },
      { name: "Word Assistant", url: "/documents/word-assistant", icon: IconFileWord },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-5">
              <span>

              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}