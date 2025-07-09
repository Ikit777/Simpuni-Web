"use client";

import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSideBar";
import Backdrop from "@/components/Backdrop";
import { useSidebar } from "@/context/SideBarContext";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[260px]"
    : "lg:ml-[80px]";

  return (
    <React.Fragment>
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="p-4 mx-auto md:p-6">{children}</div>
        </div>
      </div>
    </React.Fragment>
  );
}
