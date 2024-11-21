"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { useAuth } from "@/components/auth"
import toast from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function Login() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
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
            console.log(user, "user")

            if (user.roleId === 1) {
                router.push("/admin/dashboard")
                localStorage.setItem("user", JSON.stringify(user.nama))
                localStorage.setItem("no_karyawan", JSON.stringify(user.no_karyawan))
            } else if (user.roleId === 2) {
                router.push("/karyawan")
                localStorage.setItem("user", JSON.stringify(user.nama))
                localStorage.setItem("no_karyawan", JSON.stringify(user.no_karyawan))
                localStorage.setItem("divisi", JSON.stringify(user.divisi))
            } else if (user.roleId === 3) {
                router.push("/supervisor/dashboard")
                localStorage.setItem("user", JSON.stringify(user.nama))
                localStorage.setItem("no_karyawan", JSON.stringify(user.no_karyawan))
                localStorage.setItem("divisi", JSON.stringify(user.divisi))
            } else {
                toast.error("Login gagal, Username/Email atau Password salah")
            }

            toast.success("Login Berhasil")
        } catch (error: any) {
            toast.error("Login gagal, Username/Email atau Password salah")
        }
    }

    return (
        <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-white text-white lg:flex dark:border-r">
                <img src="assets/pbn.jpeg" className="flex m-auto" />
            </div>
            <div className="flex h-full items-center justify-center">
                <div className="mx-auto flex w-auto h-auto flex-col justify-center space-y-6 shadow-md border rounded-lg p-10 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
                    <div className="flex flex-col space-y-4 text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
                            Login
                        </h1>
                        <p className="text-sm text-gray-600">
                            Selamat datang, silahkan masukkan Email dan Password
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="identifier" className="text-gray-700">Email</Label>
                                    <Input name="identifier" onChange={handleChange} id="identifier" />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            onChange={handleChange}
                                            id="password"
                                            name="password"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleShowPassword}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <Button onClick={handleSubmit} className="w-full mt-5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-3 rounded-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
