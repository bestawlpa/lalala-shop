'use client'
import HeaderNone from "@/components/layout/HeaderNone";
import { useState,useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ToReceive(){
    const [orderData, setOrderData] = useState([]);
    console.log("order",orderData);
    const {data: session} = useSession();

    useEffect(() => {
            if(session){
                const userId = session.user._id;
                const getOrder = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/checkouts/user/${userId}`);
                    const data = await res.json();
                    const shippedOrders = data.filter(order => order.status == 'Shipped');
                    setOrderData(shippedOrders)
                } catch (error) {
                    console.log(error);
                }
            }
            getOrder();
            }
    },[session]);

    return( 
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

            <div className=" my-4">
                {orderData.map((item)=> (
                    <div key={item._id} className=" w-[600px] h-[200px] bg-white rounded-md overflow-hidden my-6">
                            <div className=" flex flex-col ">
                                <div className=" w-full h-[40px] bg-[#4D869C] p-2">
                                    <h1>Order Id : {item._id}</h1>
                                </div>
                                
                                {item.product.map((prod) => 
                                    <div className=" flex px-2 w-full h-[110px] border-b-2 border-x-slate-300">

                                        <div className=" w-[120px] h-[110px] flex items-center justify-center border-r-2 border-x-slate-300 ">
                                            <img src={prod.images[0]} alt="img" className=" w-[100px] h-[100px] rounded-md"/>
                                        </div>

                                        <div className=" w-[480px] flex flex-col justify-between h-full px-4 py-2">
                                            <div>
                                                <h1>
                                                    {prod.product_name}
                                                </h1>
                                            </div>
                                        
                                            <div className=" flex flex-col items-end">
                                                <h1>* {item.quantity}</h1>
                                                <h1>Amount Payable : {item.total}</h1>
                                            </div>
                                         </div>
                                    
                                    </div>
                                )}
                            </div>

                             
                            <div className=" w-full h-[40px] flex justify-between items-center pt-[10px] pr-6 pl-4">

                                <div className=" flex w-[310px] h-[40px] justify-between items-center font-extrabold">
                                    <h1 className=" ">TRACKING 
                                    <span className=" text-red-600"> : </span>
                                    <span className=" text-green-500  ">{item.tracking}</span></h1>
                                    
                                </div>

                                <div className=" flex w-[170px] h-[40px] justify-between items-center font-extrabold">
                                    <h1 className=" ">STATUS</h1>
                                    <h1 className=" text-red-600">:</h1> 
                                    <h1 className=" text-green-500  ">{item.status}</h1>
                                </div>
                                
                            </div>
                            
                    </div>
                ))}  
            </div>
        </div>
    )
}