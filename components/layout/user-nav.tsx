"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";
// import { signOut, useSession } from "next-auth/react";

export function UserNav() {
    // const { data: session } = useSession();
    const [name, setName] = useState("")
    const [divisi, setDivisi] = useState("")
    const [number, setNumber] = useState("")

    useEffect(() => {
        
        setName(localStorage.getItem("user")?.slice(1, -1) ?? "")
        setDivisi(localStorage.getItem("divisi")?.slice(1, -1) ?? "")
        setNumber(localStorage.getItem("no_karyawan")?.slice(1, -1) ?? "")
    })

    // console.log(name, "nama karyawan")

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-full font-bold">
                        Hi, {name}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {/* {session.user?.name} */}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {/* {session.user?.email} */}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    {/* <DropdownMenuSeparator /> */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Nomor
                            <DropdownMenuShortcut>{number}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        {divisi !== "" ? (
                            <DropdownMenuItem>
                                Divisi
                                <DropdownMenuShortcut>{divisi}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ) : (<></>)}
                        {/* <DropdownMenuItem>
                            Settings
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>New Team</DropdownMenuItem> */}
                    </DropdownMenuGroup>
                    {/* <DropdownMenuSeparator /> */}
                    {/* <DropdownMenuItem onClick={() => signOut()}>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        );
}