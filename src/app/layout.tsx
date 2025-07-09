import type { Metadata } from "next";
import { Source_Sans_3, Manrope } from "next/font/google";
import { siteDetails } from "@/data/siteDetails";
import "@/styles/globals.css";
import Providers from "./provider";
import SessionProvider from "./SessionProvider";
import SessionSync from "./SessionSync";
import { ThemeProvider } from "../context/ThemeProvider";
import { SidebarProvider } from "@/context/SideBarContext";
import { Toaster } from "sonner";

const manrope = Manrope({ subsets: ["latin"] });
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteDetails.siteUrl,
    type: "website",
    images: [
      {
        url: siteDetails.siteLogo,
        width: 1200,
        height: 675,
        alt: siteDetails.siteName,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} ${sourceSans.className} antialiased dark:bg-gray-800`}
      >
        <ThemeProvider>
          <SidebarProvider>
            <SessionProvider>
              <Providers>
                <SessionSync />
                {children}
                <Toaster
                  expand={true}
                  richColors={true}
                  closeButton={false}
                  position="bottom-right"
                />
              </Providers>
            </SessionProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
