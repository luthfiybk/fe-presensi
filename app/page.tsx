"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth"
import toast from "react-hot-toast"

export default function Login() {
    const router = useRouter()
    
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    })

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const auth = useAuth()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const data = {
            identifier: formData.identifier,
            password: formData.password,
        }

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/auth/login", data)
            const user = response.data

            const token = user.token

            auth.login(token)

            await auth.fetchUser()

            if(user.roleId === 1) {
                router.push("/admin/dashboard")
                localStorage.setItem("user", JSON.stringify(user.nama))
            } else if (user.roleId === 2) {
                router.push("/karyawan")
                localStorage.setItem("user", JSON.stringify(user.nama))
            } else if (user.roleId === 3) {
                router.push("/supervisor/dashboard")
                localStorage.setItem("user", JSON.stringify(user.nama))
            } else {
                toast.error("Login gagal, Username/Email atau Password salah")
            }

            toast.success("Login Berhasil")
        } catch (error: any) {
            toast.error("Login gagal, Username/Email atau Password salah")
        }
    }

    
    return (
        <div className="flex w-full max-h-full justify-center mt-40">
            <Card className="w-[350px] bg-gray-100">
                <CardHeader>
                    {/* <img src="/assets/pbn.jpeg" width={"100px"} height={"100px"}/> */}
                    <CardTitle className="pt-5">Selamat Datang</CardTitle>
                    <Label className="pt-2 text-gray-400">Silahkan masukkan email dan password</Label>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="identifier">Email</Label>
                                <Input name="identifier" onChange={handleChange} id="identifier" placeholder="" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" onChange={handleChange} id="password" name="password" placeholder="" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                    {/* <a className="text-xs" href="/register">Forgot password?</a> */}
                    <Button onClick={handleSubmit} type="submit" className="bg-[#6DBE45] hover:bg-[#91C539]">Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
