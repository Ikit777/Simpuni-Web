"use client";
import Link from "next/link";
import React from "react";

import { siteDetails } from "@/data/siteDetails";
import { footerDetails } from "@/data/footer";
import { getPlatformIconByName, ScrollToSection } from "@/utils";
import { usePathname, useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <footer className="bg-hero-background dark:bg-gray-900 text-foreground py-10">
      <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <h3 className="manrope text-xl font-semibold cursor-pointer text-slate-800 dark:text-slate-100">
              {siteDetails.siteName}
            </h3>
          </Link>
          <p className="mt-3.5 text-slate-600 dark:text-slate-400">
            {footerDetails.subheading}
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
            Akses Cepat
          </h4>
          <ul className="text-slate-600 dark:text-slate-400">
            {footerDetails.quickLinks.map((link) => (
              <li key={link.text} className="mb-2">
                <button
                  onClick={() => {
                    if (pathName === "/") {
                      ScrollToSection(link.id);
                    } else {
                      router.replace("/");
                    }
                  }}
                  className="hover:text-foreground"
                >
                  {link.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
            Hubungi Kami
          </h4>

          {footerDetails.email && (
            <a
              href={`mailto:${footerDetails.email}`}
              className="block text-slate-600 hover:text-foreground dark:text-slate-400"
            >
              Email: {footerDetails.email}
            </a>
          )}

          {footerDetails.socials && (
            <div className="mt-5 flex items-center gap-5 flex-wrap text-slate-800 dark:text-slate-100">
              {Object.keys(footerDetails.socials).map((platformName) => {
                if (platformName && footerDetails.socials[platformName]) {
                  return (
                    <Link
                      href={footerDetails.socials[platformName]}
                      key={platformName}
                      aria-label={platformName}
                    >
                      {getPlatformIconByName(platformName)}
                    </Link>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 px-6 text-slate-800 dark:text-slate-100 text-center">
        <p>
          Copyright &copy; {new Date().getFullYear()} Disperkim Kota Banjarbaru
        </p>
        <p className="text-sm mt-2 text-gray-500 dark:text-slate-400 text-center">
          Dibuat oleh
        </p>
        <p className="text-sm mt-2 text-slate-600 dark:text-slate-400 text-center">
          AhmadFaisal & MuhRizkiAkbar
        </p>
      </div>
    </footer>
  );
};

export default Footer;
