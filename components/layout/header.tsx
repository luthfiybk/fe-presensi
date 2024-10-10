import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { NavItem } from "@/types";
import Sidebar from "./sidebar";

interface IHeaderProps {
    link: string;
    children?: React.ReactNode;
    items: NavItem[];
    name?: string
}

export default function Header({ link, items, children, name }: IHeaderProps) {
    return (
        <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
            <nav className="h-14 flex items-center justify-between px-4">
                {/* Wrapper untuk Link dan Children diatur menjadi flexbox */}
                <div className="hidden lg:flex justify-end items-center gap-1">
                    {/* Children */}
                    {children}

                    {/* Link */}
                    <Link href={link}>
                        <img src="/assets/pbn.jpeg" width={"80px"} />
                    </Link>
                </div>

                {/* Mobile sidebar, hanya muncul di mobile */}
                <div className={cn("block lg:hidden")}>
                    <MobileSidebar items={items} />
                </div>

                <div className="flex items-center gap-2 mr-10">
                    <UserNav />
                </div>
            </nav>
        </div>
    );
}
