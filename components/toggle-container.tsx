"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "@/components/nav-menu" ;
import Link from "next/link";
import { GenerateButton } from "./generate-button";


export const ToggleContainer = ({isAuthenticated}: {isAuthenticated?: boolean}) => {
    return (
        <Sheet>
            <SheetTrigger className="min-md:hidden">
                <Menu />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle />
                    
                </SheetHeader>
                <div className="p-8 space-y-12">
                    <NavMenu isMobile/>
                    <Link href={isAuthenticated ? "/dashboard" : "/sign-in"}>
                    <GenerateButton label="Generate" />
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    )
}
