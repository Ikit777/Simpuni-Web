"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/globals.css";
import React from "react";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <Header />
      {children}
      <Footer />
    </React.Fragment>
  );
}
