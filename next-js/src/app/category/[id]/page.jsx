'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNone from "@/components/layout/HeaderNone";

export default function Category({params}){
    const [product ,setProduct] = useState([]);
    
    const getCategory = async () => {
        try {
            const res = await fetch('http://localhost:3000/products/');
            const data = await res.json()
            console.log(data);  
            setProduct(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategory()
    },[])
    return(
        <div>
            <HeaderNone/>
            <div className="flex flex-row justify-center items-center my-8">
            <div className="grid grid-cols-4 gap-8">
                {product.map((item) => {
                    if(item.category_id === params.id)
                        return(
                            <div key={item.product_id} className="w-[220px] h-[280px] bg-white rounded-2xl overflow-hidden">
                                <Link href={'/detail/' + item.product_id} className="h-full">
                                    <div className="w-[220px] h-[180px]">
                                        <img src={item.images[0]} style={{ height: '180px', width: '220px' }} />
                                    </div>

                                    <div className="h-[100px] w-[200px] mt-[10px] mx-3 flex flex-col justify-center text-ellipsis/">
                                        <div className="w-full h-[50px] text-ellipsis font-medium">
                                            <p>{item.product_name}</p>
                                        </div>

                                        <div className="flex justify-end text-[#E72929] font-bold h-[40px] w-40 relative left-[40px] top-[5px] ">
                                            <p>${item.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                })}
            </div>
        </div>
        </div>
    )
}
