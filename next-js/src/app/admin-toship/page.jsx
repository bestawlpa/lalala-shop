'use client'
import { useEffect, useState } from "react";
import HeaderNone from "@/components/layout/HeaderNone";
import Link from "next/link";

export default function AdminToShip() {
    const [receipts, setReceipts] = useState([]);

    const fetchReceipts = async () => {
        try {
            const res = await fetch('http://localhost:3000/receipts');
            const data = await res.json();
            const Processed = data.filter(order => order.status === 'Processed');
            setReceipts(Processed);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const updateCheckoutStatus = async (checkoutId) => {
        try {
            const res = await fetch(`http://localhost:3000/checkouts/${checkoutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Packaging' })
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
    };

    const updateReceiptStatus = async (receiptId) => {
        try {
            const res = await fetch(`http://localhost:3000/receipts/${receiptId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Approved' })
            });

            if (!res.ok) {
                console.error('Failed to update receipt status');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error updating receipt status:', error);
            return false;
        }
    };

    const handleApprove = async (checkoutId, receiptId) => {
        const isCheckoutUpdated = await updateCheckoutStatus(checkoutId);
        if (isCheckoutUpdated) {
            const isReceiptUpdated = await updateReceiptStatus(receiptId);
            if (isReceiptUpdated) {
                fetchReceipts(); // Fetch new data after updating status
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <HeaderNone />
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
            <div>
                {receipts.map((item) => (
                    <div key={item._id} className="flex justify-between my-6 w-[600px] h-[250px] bg-white">
                        <div>
                            <img src={`${item.receiptImageUrl}`} alt="img" className="w-[200px] h-[250px] hover:scale-160" />
                        </div>

                        <div>
                            {item.Checkout.map((ch) => (
                                <div className=" mt-3">
                                    <div key={ch._id} className=" font-bold">
                                        <p>Order: {ch._id}</p>
                                        <p className=" text-red-600">Total: <span className=" text-black">{ch.total}</span></p>
                                    </div>
                                    
                                </div>
                                
                            ))}
                        </div>

                        {item.Checkout.map((ch) => (
                            <div key={`${ch._id}-button`} className="w-[80px] h-full  flex items-center justify-center bg-white ">
                                <button onClick={() => handleApprove(ch._id, item._id)} className=" w-[70px] h-[30px] bg-red-500 px-2 py-1  text-black rounded flex justify-center items-center">Approve</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
