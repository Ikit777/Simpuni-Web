"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiOutlineXMark, HiBars3 } from "react-icons/hi2";
import Image from "next/image";
import { siteDetails } from "@/data/siteDetails";
import { menuItems } from "@/data/menuItems";
import { LuX } from "react-icons/lu";
import { ScrollToSection } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ThemeToggleButton } from "./ThemeToggleButton";

const Header: React.FC = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const [currentSection, setCurrentSection] = useState<
    string | null | undefined
  >("home");

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    const nav = document.getElementById("nav");
    if (window.scrollY > 10) {
      nav?.classList.add("shadow");
      nav?.classList.add("bg-background");
      nav?.classList.add("dark:bg-gray-900");
      nav?.classList.remove("bg-transparent");
    } else {
      nav?.classList.remove("shadow");
      nav?.classList.add("bg-transparent");
      nav?.classList.remove("bg-background");
      nav?.classList.remove("dark:bg-gray-900");
    }

    const sections = menuItems.map((item) => item.id);

    const visibleSection = sections.find((section) => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= -(element.clientHeight - 80);
      }
      return false;
    });
    setCurrentSection(visibleSection);
  };

  return (
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
          <span className="manrope text-xl font-semibold text-foreground cursor-pointer text-slate-800 dark:text-slate-100">
            {siteDetails.siteName}
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item) => (
            <li key={item.text}>
              <button
                onClick={() => {
                  if (pathName === "/") {
                    ScrollToSection(item.id);
                  } else {
                    router.replace("/");
                  }
                }}
                className={`text-foreground text-lg hover:text-foreground-accent dark:hover:text-slate-400 transition-colors ${
                  currentSection === item.id
                    ? "text-primary-500"
                    : "text-foreground dark:text-slate-100"
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
          <li>
            <Link
              href={`${session ? "/admin" : "/login"}`}
              className="text-white bg-primary-500 hover:bg-primary-600 px-6 py-2 rounded-full transition-colors"
            >
              Login
            </Link>
          </li>
          <li>
            <ThemeToggleButton />
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggleButton />
          <button
            onClick={toggleMenu}
            type="button"
            className="bg-transparent text-black focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
            ) : (
              <HiBars3 className="h-6 w-6" aria-hidden="true" />
            )}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>
      </nav>

      <div className={`${isOpen ? "flex" : "hidden"}`}>
        <div
          className="py-1 z-30 top-0 left-0 w-full min-h-screen fixed 
  bg-gradient-to-b from-primary-900 via-primary-950 to-primary-900 
  dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
        >
          <div className="w-full flex items-center justify-end py-3 pr-9 ml-2">
            <button
              onClick={() => {
                toggleMenu();
              }}
              aria-label="menu"
            >
              <LuX size={24} className="text-white" />
            </button>
          </div>
          <ul className="uppercase text-white text-md tracking-widest items-center flex flex-col mt-6 px-4">
            {menuItems.map((nav, index) => (
              <li
                key={nav.id}
                className={`hover:text-primary-500 transition duration-200 py-4 ${
                  index == 0 ? "border-t" : ""
                } border-b border-theme-grayish-blue w-full text-center`}
              >
                <button
                  onClick={() => {
                    if (pathName === "/") {
                      ScrollToSection(nav.id);
                      toggleMenu();
                    } else {
                      router.replace("/");
                      toggleMenu();
                    }
                  }}
                  className={`${
                    currentSection === nav.id
                      ? "text-primary-500"
                      : "text-neutral-100"
                  }`}
                >
                  {nav.text}
                </button>
              </li>
            ))}
            <li className="bg-transparent border-2 rounded px-6 py-2 mt-6 w-full text-center text-neutral-100 cursor-pointer hover:bg-primary-900 transition duration-200">
              <button
                onClick={() => {
                  if (!session) {
                    router.push("/login");
                  } else {
                    router.push("/admin");
                  }

                  toggleMenu();
                }}
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
