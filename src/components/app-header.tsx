"use client";

import React from "react";
import Logo from "./logo";
import path from "path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
  },
  {
    label: "Account",
    path: "/app/account",
  },
];

const AppHeader = () => {
 const activePathname =
  usePathname();
  return (
    <header className="flex justify-between border-b border-white/10 py-2 items-center">
      <Logo />
      <nav>
        <ul className="flex gap-x-2 text-xs">
          {routes.map((route) => (
            <li key={route.path}>
              <Link className={cn("text-white/70 rounded-sm px-2 py-1 hover:text-white focus:text-white transition", {
                "bg-black/10 text-white" : activePathname === route.path,
              })} href={route.path}>{route.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
