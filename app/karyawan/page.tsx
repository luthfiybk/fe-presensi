"use client"

import BreadCrumb from "@/components/breadcrumb";
import Gmaps from "@/components/gmaps";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Clock from 'react-live-clock';
import axios from "axios";
import Cookies from "js-cookie";

// const breadcrumbItems = [{ title: "Presensi", link: "/karyawan/presensi" }];
export default function PresensiPage() {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
            },
            error => {
                console.error('Error getting user location:', error);
            }
        )
    }, []);

    const [formData, setFormData] = useState({
        latitude: null,
        longitude:null,
    })

    const handleChange = (e: any) => {
        const {name, value} = e.target
        setFormData({...formData , [name]: value})
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const form = {
            latitude: latitude,
            longitude: longitude,
        }

        console.log("Submitted data: ", form)

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/presensi/masuk", form , {
                headers: {
                    Authorization: `Bearer ${Cookies.get("authToken")}`,
                }
            })
            console.log(response.data)
        } catch (error: any) {
            alert("Presensi gagal")
            console.log(error.message)
        }
    }

    return (
        <>
            <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
                {/* <BreadCrumb items={breadcrumbItems} /> */}
                <div className="flex w-full justify-center">
                    <div className="flex flex-col gap-2 items-center" suppressHydrationWarning>
                        <p>Jam</p>
                        <Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Jakarta'} noSsr={true}/>
                        <Gmaps width="400px" height="300px"/>
                        <form onSubmit={handleSubmit}>
                            <input type="text" onChange={handleChange} value={latitude} className="w-2/3 bg-gray-200" id="latitude" hidden required/>
                            <input type="text" onChange={handleChange} value={longitude} className="w-2/3 bg-gray-200" id="longitude" hidden required/>
                        </form>
                        <Button onClick={handleSubmit} className="w-2/3 bg-green-500">
                            Presensi
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}