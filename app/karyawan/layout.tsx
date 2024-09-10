import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";
import Header from "@/components/layout/header";
import { karyawanItems } from "@/constants/data";

export const metadata: Metadata = {
    title: "Presensi - Karyawan",
    description: "Basic dashboard with Next.js and Shadcn",
};

export default function PresensiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header link="http://localhost:3000/karyawan" items={karyawanItems}>
                <Sidebar items={karyawanItems} />
            </Header>
            <div className="flex h-full">
                <main className="w-full pt-16 h-full">{children}</main>
            </div>
        </>
    );
}