'use client'

import HeaderNone from "@/components/layout/HeaderNone"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"

export default function CheckOut() {
    const [orderData, setOrderData] = useState([]);
    const { data: session } = useSession();
    console.log(session);
    

    useEffect(() => {
        if(session){
            const userId = session.user._id;
            const getOrder = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/checkouts/user/${userId}`);
                    const data = await res.json();
                    const paidOrders = data.filter(order => order.status == 'Pending');
                    setOrderData(paidOrders)
                } catch (error) {
                    console.log(error);
                }
            }
            getOrder();
        };
    },[session]);


    const updateProductStock = async (productId, quantityToAdd) => {
        try {
            const productResponse = await fetch(`http://localhost:3000/products/${productId}`);
            const productData = await productResponse.json();

            const updatedProductData = {
                ...productData,
                inventory_quantity: productData.inventory_quantity + quantityToAdd
            };

            const res = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProductData)
            });

            if (!res.ok) {
                throw new Error('Failed to update product stock');
            }
        } catch (error) {
            console.error('Error updating product stock:', error);
        }
    };

    const cancelOrder = async (orderId, productId, quantity) => {
        try {
            const res = await fetch(`http://localhost:3000/checkouts/${orderId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setOrderData(prevOrder => prevOrder.filter(item => item._id !== orderId));
                // Update product stock
                await updateProductStock(productId, quantity);
            } else {
                console.error('Failed to delete order from checkout');
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    

    return (
        <div className="flex flex-col items-center justify-center">
            <HeaderNone />
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
            <div className="w-full flex justify-center my-8">
                <div className="bg-transparent flex items-center flex-col rounded-md">
                    {orderData.map((item) =>
                        <div key={item._id} className=" w-[600px] h-[200px] bg-white rounded-md overflow-hidden m-2">
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
                            
                            {item.product.map((prod) => 
                                <div className=" w-full h-[40px] flex justify-between items-center pt-[10px]">
                                
                                <div className=" flex justify-center items-center ml-4 h-[35px] w-[120px] bg-red-400 rounded-lg">
                                    <button  onClick={() => cancelOrder(item._id, prod.product_id, item.quantity)}>Cancle Order</button>
                                </div>

                                <div  className=" flex justify-center items-center mr-4   h-[35px] w-[120px] bg-red-400 rounded-lg">
                                    <Link  href={'/paynow/'+item._id}>Pay Now</Link>
                                </div>
                            </div>
                            )}
                            
                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};


