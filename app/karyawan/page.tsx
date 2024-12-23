"use client";

// @refresh reset
import { useState, useEffect, useRef, useCallback } from "react";
import Clock from "react-live-clock";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { headers } from "next/headers";

export default function PresensiPage() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [cekPresensi, setCekPresensi]: any = useState([]);
  const [cekIzin, setCekIzin]: any = useState([]);
  const webcamRef: any = useRef(null);
  const [img, setImg] = useState(null);
  const [isPresensiSubmitted, setIsPresensiSubmitted] = useState(false);
  const [waktu, setWaktu] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const jamSekarang = () => {
    const getTime = new Date().getHours().toString().padStart(2, "0")

    setWaktu(getTime);
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null;
    setImg(imageSrc);
  }, [webcamRef]);

  const checkPresensi = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/user/presensi/check", {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });

      setCekPresensi(response.data);
    } catch (error: any) {
      console.error("Fetch presensi error", error.message);
    }
  };

  const checkIzin = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/user/izin/check", {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });

      setCekIzin(response.data);
    } catch (error: any) {
      console.error("Fetch izin error", error.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = {
      latitude: latitude,
      longitude: longitude,
      photo: img,
    };

    console.log("Submitted data: ", form);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/presensi/masuk", form, {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });

      if (response.status === 201) {
        toast.success("Presensi berhasil");
        setIsPresensiSubmitted(true);
      }
    } catch (error: any) {
      toast.error("Presensi gagal, berada di luar kawasan kantor");
      console.error(error.message);
    }
  };

  const handlePulang = async (e: any) => {
    e.preventDefault()

    try {
      const response = await axios.put(process.env.NEXT_PUBLIC_API_URL + "/presensi/pulang", {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        }
      })

      if (response.status === 201) {
        toast.success("Presensi pulang berhasil")
      }
    } catch (error: any) {
      toast.error("Presensi pulang gagal")
      console.error(error.message)
    }
  }

  useEffect(() => {
    checkPresensi();
    checkIzin();
    jamSekarang();
  }, []);

  const videoConstraints = {
    facingMode: "user",
  };

  return (
    <>
      <div className="flex-1 h-full space-y-4 p-4 md:p-8 pt-6">
        <div className="flex w-full justify-center">
          <Card className="border-black rounded-2xl">
            <CardContent className="py-4">
              <div className="flex flex-col gap-2 items-center" suppressHydrationWarning>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <p className="font-bold">Tanggal</p>
                    <Clock
                      format={"dddd, DD MMMM YYYY"}
                      ticking={true}
                      timezone={"Asia/Jakarta"}
                      noSsr={true}
                      className="font-bold"
                    />
                  </div>
                  <div className="flex flex-row items-center gap-9">
                    <p className="font-bold">Jam</p>
                    <Clock
                      format={"HH:mm:ss"}
                      ticking={true}
                      timezone={"Asia/Jakarta"}
                      noSsr={true}
                      className="font-bold"
                    />
                  </div>
                </div>
                {waktu >= "8" && waktu < "17" ? (
                <div>
                  {img === null ? (
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
                    <img src={img} alt="Captured" className="w-full" height={100} width={100} />
                  )}
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={latitude}
                      className="w-2/3 bg-gray-200"
                      id="latitude"
                      hidden
                      readOnly
                    />
                    <input
                      type="text"
                      value={longitude}
                      className="w-2/3 bg-gray-200"
                      id="longitude"
                      hidden
                      readOnly
                    />
                    {(!isPresensiSubmitted && cekPresensi?.[0]?.jamMasuk === "" && cekIzin.length === 0 && img !== null) && (
                      <Button type="submit" className="w-2/3 bg-green-500 hover:bg-green-400">
                        Presensi Masuk
                      </Button>
                    )}
                  </form>
                </div>
              ) : waktu >= "17" && waktu <= "24" && cekPresensi?.[0]?.jamPulang === "" && cekIzin.length === 0 ? (
                <Button onClick={handlePulang} className="w-2/3 bg-green-500 hover:bg-green-400">
                  Presensi Pulang
                </Button>
              ) : (
                <div>Anda sudah melakukan presensi</div>
              )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
