"use client"

// @refresh reset
import BreadCrumb from "@/components/breadcrumb";
import Gmaps from "@/components/gmaps";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import Clock from 'react-live-clock';
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Webcam from "react-webcam"
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

// const breadcrumbItems = [{ title: "Presensi", link: "/karyawan/presensi" }];
export default function PresensiPage() {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [check, setCheck]: any = useState([]);
    const webcamRef: any = useRef(null)
    const [img, setImg] = useState(null)

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

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null
        setImg(imageSrc)
    }, [webcamRef])

    const checkPresensi = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/user/presensi/check", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("authToken")}`,
                }
            })
            
            setCheck(response.data)
        } catch (error: any) {
            console.error("Fetch presensi error", error.message)
        }
    }

    const [formData, setFormData] = useState({
        latitude: null,
        longitude:null,
        photo: null
    })

    const handleChange = (e: any) => {
        const {name, value} = e.target
        setFormData({...formData , [name]: value})
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        const form = {
            latitude: latitude,
            longitude: longitude,
            photo: img
        };

        console.log("Submitted data: ", form);

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/presensi/masuk", form , {
                headers: {
                    Authorization: `Bearer ${Cookies.get("authToken")}`,
                }
            })

            if (response.status === 201) {
                toast.success("Presensi berhasil")
            }
        } catch (error: any) {
            toast.error("Presensi gagal, berada di luar kawasan kantor")
            console.error(error.message)
        }
    }

    useEffect(() => {
        checkPresensi()
    }, [])

    const videoConstraints = {
        facingMode: "user"
    }

    return (
        <>
            <div className="flex-1 h-full space-y-4 p-4 md:p-8 pt-6">
                {/* <BreadCrumb items={breadcrumbItems} /> */}
                <div className="flex w-full justify-center">
                    <Card className="border-black rounded-2xl">
                        <CardContent className="py-4">
                            <div className="flex flex-col gap-2 items-center" suppressHydrationWarning>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-row items-center gap-2">
                                        <p className="font-bold">Tanggal</p>
                                        <Clock format={'dddd, DD MMMM YYYY'} ticking={true} timezone={'Asia/Jakarta'} noSsr={true} className="font-bold" />
                                    </div>
                                    <div className="flex flex-row items-center gap-9">
                                        <p className="font-bold">Jam</p>
                                        <Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Jakarta'} noSsr={true} className="font-bold"/>
                                    </div>
                                </div>
                                {img === null ?  (
                                    <>
                                        <Webcam 
                                            videoConstraints={videoConstraints}
                                            mirrored={true}
                                            className="w-3/4"
                                            screenshotFormat="image/jpeg"
                                            ref={webcamRef}
                                        />
                                        <Button onClick={capture} className="w-2/3 bg-green-500 hover:bg-green-400 mt-2">
                                            Ambil Foto
                                        </Button>
                                    </>
                                ) : (
                                    <img src={img} className="w-full" height={"100px"} width={"100px"}/>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <input type="text" onChange={handleChange} value={latitude} className="w-2/3 bg-gray-200" id="latitude" hidden required/>
                                    <input type="text" onChange={handleChange} value={longitude} className="w-2/3 bg-gray-200" id="longitude" hidden required/>
                                </form>
                                {check.length === 0 && img !== null ? (
                                    <Button onClick={handleSubmit} className="w-2/3 bg-green-500 hover:bg-green-400">
                                        Presensi Masuk
                                    </Button>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}