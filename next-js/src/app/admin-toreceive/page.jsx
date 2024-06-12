'use client'
import { useEffect, useState } from "react";
import HeaderNone from "@/components/layout/HeaderNone";
import Link from "next/link";

export default function AdminToReceive() {
    const [order, setOrder] = useState([]);
    const [tracking, setTracking] = useState("");

    const getOrder = async () => {
        try {
            const res = await fetch(`http://localhost:3000/checkouts/`);
            const data = await res.json();
            const packagingOrders = data.filter(order => order.status == 'Packaging');
            setOrder(packagingOrders)
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (itemId) => {
        try {
            const res = await fetch(`http://localhost:3000/checkouts/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Shipped' ,tracking: tracking})
            });

            if (!res.ok) {
                console.error('Failed to update checkout status');
                return false;
            }

            return true;
            
        } catch (error) {
            console.error('Error updating checkout status:', error);
            return false;
        }
    }

    useEffect(() => {
        getOrder();
    },[])

    return(
        <div className="flex flex-col items-center justify-center">
            <HeaderNone/>
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
            <div className=" my-6 w-[680px]">
                {order.map((item) => (
                    <form key={item._id}>
                        <div className=" flex my-6 w-full py-6 h-[40px] rounded-lg justify-around items-center bg-orange-100">
                            <h1 className=" text-green-600 font-bold">ORDER_ID : <span className=" font-medium text-slate-950">{item._id}</span></h1>
                            <input type="text" placeholder="tracking" name="track" onChange={(e) => setTracking(e.target.value)} className="px-2 rounded-md h-[30px]" />
                            <button className=" h-[30px] w-[65px] rounded-md bg-red-600 font-extrabold" onClick={() => handleSubmit(item._id)}>submit</button>
                        </div>
                    </form>
                ))}
            </div>
        </div>
    )
};


