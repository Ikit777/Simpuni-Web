"use client";

import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { siteDetails } from "@/data";
import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <header
        id="nav"
        className="fixed top-0 left-0 right-0 z-50 mx-auto w-full px-1 md:px-10"
      >
        <nav className="mx-auto flex justify-between items-center py-2 px-5 md:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={siteDetails.siteLogo}
              alt={siteDetails.siteName}
              width={20}
              height={20}
            />
            <span className="manrope text-xl font-semibold cursor-pointer text-slate-800 dark:text-slate-100">
              {siteDetails.siteName}
            </span>
          </Link>
          <ThemeToggleButton />
        </nav>
      </header>
      {children}
    </React.Fragment>
  );
}
