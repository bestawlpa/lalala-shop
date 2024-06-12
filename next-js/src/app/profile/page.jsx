'use client'

import HeaderNone from "@/components/layout/HeaderNone"
import { useSession,signOut } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../loading";

export default function Profile(){
    const {data: session,status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            return;
        } 
        if (!session) {
            router.push("/login");
        }  else if (session.user.role === "admin") {
            router.push('/admin');
        }
    }, [session, status]);
        
    if (status === "loading") {
        return (    
            <div>
                <Loading/>
            </div>
        );
    };
    

    if (!session) {
        return null;
    };
            
    return (
        <div className="flex flex-col items-center justify-center">
            <HeaderNone/>
            <div>
                <div className=" w-[400px] h-[50px] bg-white flex justify-between items-center py-2  rounded-md mt-4">
                    <div className=" w-[133px] h-full flex items-center justify-center">
                        <Link href={'/order'} className=" text-red-700 hover:text-[#EEEEEE] font-bold flex justify-center items-center w-[96px] h-[35px] hover:bg-[#A91D3A] transition-all duration-2000 ease-in-out hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">To Pay</Link>
                    </div>
                        
                    <div className=" w-[134px] h-full flex items-center justify-center  border-x-2  border-green-700 ">
                        <Link href={'/toship'} className=" text-red-700 hover:text-[#EEEEEE] font-bold flex justify-center items-center w-[96px] h-[35px] hover:bg-[#A91D3A] transition-all  duration-2000 ease-in-out hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">To Ship</Link>
                    </div>

                    <div className=" w-[133px] h-full flex items-center justify-center ">
                        <Link href={'/toreceive'} className=" text-red-700 hover:text-[#EEEEEE] font-bold flex justify-center items-center w-[96px] h-[35px] hover:bg-[#A91D3A] transition-all duration-2000 ease-in-out hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">To Receive</Link>            
                    </div>    
                </div>
            </div>

            <div className=" w-[300px] h-[200px] bg-white px-5  rounded-lg p-2 mt-10">
                <div className=" w-full h-[50px] flex justify-center">                
                    <h1 className=" text-2xl font-extrabold text-lime-900">Profile</h1>
                </div>

                <div  className=" w-full h-[80px] flex justify-center items-center"> 
                    <div className=" flex flex-col justify-start">
                        <p className=" text-lg font-extrabold text-red-600">Email : <span className=" text-amber-950">{session?.user?.email}</span></p>
                        <p className=" text-lg font-extrabold text-red-600">Name : <span className=" text-amber-950">{session?.user?.username}</span></p>
                    </div>
                </div>

                <div className=" w-full h-[50px] flex justify-center items-center">
                    <button className=" h-[30px] w-[80px] rounded-lg bg-gray-200" onClick={()=>signOut()}>Logout</button>
                </div>
            </div>
        </div>
    )
};

