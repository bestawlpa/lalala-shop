'use client'
import Link from "next/link";
import React,{ useState } from "react";
import {ROUTES} from "../api/endpoint/route";
import { useRouter } from "next/navigation";
import HeaderNone from "@/components/layout/HeaderNone";


export default function Register(){
    const [username ,setUsername] = useState("");
    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [confirmpassword ,setConfirmpassword] = useState("");
    const [error ,setError] = useState("");
    const [success ,setSuccess] = useState("");
    const router =useRouter();   
   
    
    const hadleSubmit = async (e) => {
        e.preventDefault();

        if( password != confirmpassword) {
            setError("Password do not match!")
            return;
        }

        if( !username || !email || !password || !confirmpassword){
            setError("Please complete all !")
            return;
        }

        try {
        
            const res = await fetch("http://localhost:3000/users",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    username,email,password
                })
            })

            if(res.ok){
                const form = e.target;
                setError("");
                setSuccess("User registration seccessfully")
                form.reset();
                setTimeout(() => {
                    router.push(ROUTES.LOGIN);
                }, 2000);
            } else {
                console.log("User registration failed.");
                const data = await res.json();
                setError(data.error);
            }
        } catch (error) {
            console.log(error)
        }
    }


    return(
        <div>
            <HeaderNone/>
            <div className=" w-full flex flex-col justify-center items-center mt-8">
            <h1 className=" font-extrabold text-[20px]">Register</h1>
            <br />
            <div className=" w-[420px]  flex flex-col justify-center items-center">
                <form onSubmit={hadleSubmit} className=" w-[380px] h-[380px] bg-white flex flex-col justify-center  items-center rounded-md">
                    {error && (
                        <div className=" bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2 ">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className=" bg-green-400 w-fit text-sm text-white py-1 px-3 rounded-md mt-2 ">
                            {success}
                        </div>
                    )}
                    <div className=" flex flex-col mt-4 w-[300px] h-[300px]  items-center">
                        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your name" className=" rounded-md px-2 h-[30px] w-[260px] m-3 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className=" rounded-md px-2 h-[30px] w-[260px] m-3 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className=" rounded-md px-2 h-[30px] w-[260px] m-3 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                        <input onChange={(e) => setConfirmpassword(e.target.value)} type="password" placeholder="Confirm your password" className=" rounded-md px-2 h-[30px] w-[260px] m-3 bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "/>
                        <button type="submit" className=" w-[80px] h-[30px] bg-red-300 mt-3">sign up</button>
                    </div>
                    
                </form>
                <br />
                <h3 className=" text-center">Already have an accout ? go to <Link href={ROUTES.LOGIN} className=" text-red-700">Login</Link></h3>
            </div>
            </div>
        </div>
        
    )
};