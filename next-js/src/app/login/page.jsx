// src/app/login/page.js

'use client'
import Link from "next/link"
import HeaderNone from "@/components/layout/HeaderNone"
import React,{useState,useEffect} from "react"
import {ROUTES} from "../api/endpoint/route"
import { useRouter } from "next/navigation"
import { signIn,useSession } from "next-auth/react"


export default function Login(){
    const [email ,setEmail] = useState("test@hotmail.com");
    const [password ,setPassword] = useState("Test01");
    const [error ,setError] = useState("");
    const { data: session } = useSession();
    const router =useRouter();

    useEffect(() => {
        if (session) {
            // Check the role and redirect accordingly
            if (session.user.role === "admin") {
                router.push(ROUTES.ADMIN);
            } else {
                router.push(ROUTES.HOME);
            }
        }
    }, [session]);

    const handleLogin = async () => {
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (res.error) {
                setError("Invalid credentials");
                return;
            }
            // router.push(ROUTES.HOME);

        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div>
            <HeaderNone/>
            <div className=" flex flex-col justify-center items-center w-full mt-8">
                <h1 className=" font-extrabold text-[20px]">LOGIN</h1>
                <br />
                <hr />
                <div className=" w-[300px] rounded-lg bg-white flex flex-col justify-center items-center">
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        {error && (
                            <div className=" bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2 ">
                                {error}
                            </div>
                        )}
                        <div className=" flex flex-col justify-center items-center mt-4 w-[300px] h-[200px]">
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter your email" className=" rounded-md px-2 h-[30px]  h- m-3 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className=" rounded-md px-2 h-[30px]  h- m-3 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                            <button type="submit"  className=" w-[80px] h-[30px] bg-red-300 mt-3">Login</button>
                        </div>
                    </form>
                </div>
                <br />
                <h3>Do not have an account ? go to <Link href="/register" className=" text-red-700">Register</Link></h3>
            </div>
        </div>
    )
};