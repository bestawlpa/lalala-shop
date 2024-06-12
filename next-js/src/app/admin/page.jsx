'use client'
import { useSession,signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Loading from "../loading";
import HeaderAdmin from "../../components/layout/HeaderAdmin"

export default function Admin(){
    const {data: session,status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            return;
        } 
        if (!session) {
            router.push("/login");
        } else if (session.user.role === "user") {
            router.push('/');
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
    
    return(
        <div className="flex flex-col items-center justify-center">
            <HeaderAdmin/>
            <div>
                <div className=" w-[280px] h-[50px] bg-white flex justify-between items-center py-2  rounded-md mt-4">
                    <div className=" w-[135px] h-full flex items-center justify-center  border-r-2  border-green-700 ">
                        <Link href={'/admin-toship'} className=" text-red-700 hover:text-[#EEEEEE] font-bold flex justify-center items-center w-[96px] h-[35px] hover:bg-[#A91D3A] transition-all  duration-2000 ease-in-out hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">To Ship</Link>
                    </div>

                    <div className=" w-[135px] h-full flex items-center justify-center border-l-2  border-green-700 ">
                        <Link href={'/admin-toreceive'} className=" text-red-700 hover:text-[#EEEEEE] font-bold flex justify-center items-center w-[96px] h-[35px] hover:bg-[#A91D3A] transition-all duration-2000 ease-in-out hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">To Receive</Link>            
                    </div>    
                </div>
            </div>
            <div className=" w-full h-[50px] flex justify-center items-center">
                    <button className=" h-[30px] w-[80px] rounded-lg bg-gray-200" onClick={()=>signOut()}>Logout</button>
                </div>
        </div>
    )
};