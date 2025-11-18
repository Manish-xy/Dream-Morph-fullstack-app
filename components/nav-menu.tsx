"use client"

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { NavRoutes } from "@/lib/helper";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavMenuProps {
    isMobile?: boolean;
}
export const NavMenu = ({ isMobile }: NavMenuProps) => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  // only include public routes or protected ones if the user is signed in
  const filteredRoutes = NavRoutes.filter(route => !route.protected || isSignedIn);

  return <nav className={cn("flex gap-8", isMobile && "flex-col items-start gap-12")}>
    {filteredRoutes.map(route => {
        // const isActive = pathname.startsWith(route.link);
      const isActive = route.link === "/" ? pathname === "/" : pathname.startsWith(route.link);
      return (
        <Link key={route.link} href={route.link} className={cn("text-white/70 hover:text-white transition", isActive && "text-white")}>
            {route.label}
        </Link>
      )
    })}
  </nav>
}
