"use client"
import { IzinClient } from "@/components/tables/izin-tables/client"
import axios from "axios"
import { usePathname } from "next/navigation"
import { useState, useEffect, use } from "react"
import Cookies from "js-cookie"
type paramsProps = {
    searchParams: {
        [key: string]: string | string[] | undefined;
    }
}


export default function RekapIzin({ searchParams }: paramsProps) {
    const [izin, setIzin] = useState([])
    const [totalData, setTotalData] = useState(0)
    const pathname = usePathname()

    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const offset = (page - 1) * limit;

    const handleRekapIzin = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/izin/rekap?limit=${limit}&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("authToken")}`
                }
            })
            
            const data = response.data.data

            const mappedData = data.map((item: any) => {
                return {
                    ...item,
                    tanggal: (item.tanggal.slice(0, 10)),
                }
            })

            setTotalData(response.data.total_data)
            setIzin(mappedData)
        } catch (error) {
            console.error("Fetch rekap izin error", error)
        }
    }

    useEffect(() => {
        handleRekapIzin()
    }, [])

    return (
        <>
            <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
                <IzinClient data={izin} path={pathname} searchParams={searchParams} total_data={totalData} />
            </div>
        </>
    )
}