"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Clock from 'react-live-clock';
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import dynamic from 'next/dynamic';
import 'chart.js/auto';
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});

export default function DashboardPage() {
    const [response, setResponse] = useState([])
    const [name, setName] = useState('')
    const [hadir, setHadir] = useState("")
    const [izin, setIzin] = useState("")

    const fetchResponse = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/supervisor/", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("authToken")}`,
                }
            
            })
            const data = response.data
            setHadir(data[1].total)
            setIzin(data[2].total)
            setResponse(data)
        } catch (error) {
            console.error("Fetch dashboard data error", error)
        }
    }

    const data = {
        labels: ['Hadir', 'Izin'],
        datasets: [
          {
            label: 'Chart',
            data: [parseInt(hadir), parseInt(izin)],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
                borderWidth: 1,
            },
        ],
      };

    useEffect(() => {
        fetchResponse()
        const nama = localStorage.getItem("user")?.slice(1, -1) ?? ""
        setName(nama)
    }, [])

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-5 md:p-8 pt-16">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                    </h2>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                            {response.map((data: any) => (
                                <Card className="flex flex-col gap-1">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-md font-medium h-10">
                                            {data.kolom}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold ">{data.total}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <div className="w-full m-auto" style={{ width: '700px', height: '700px' }}>
                        <Bar className="flex w-full justify-center" data={data} />
                    </div>
                </Tabs>
            </div>
        </ScrollArea>
    );
}