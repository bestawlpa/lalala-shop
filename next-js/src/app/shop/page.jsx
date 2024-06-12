'use client'

import Link from "next/link";
import HeaderNone from "@/components/layout/HeaderNone";
import React, { useEffect, useState } from "react";
import { ROUTES } from "../api/endpoint/route";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "../loading";

export default function Shop() {
    const [category, setCategory] = useState([]);
    const { data: session, status } = useSession();
    console.log('status',status);
    const router = useRouter();


    const getCategories = async () => {
        try {
            const res = await fetch('http://localhost:3000/categories');
            const data = await res.json();
            console.log(data);
            setCategory(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (status === "loading") {
            return;
        } 
        if (!session) {
            router.push(ROUTES.LOGIN);
        }
    }, [session, status]);

    useEffect(() => {
        if (session) {
            getCategories();
        }
    }, [session]);

   
    if (status === "loading") {
        return (
            <div>
                <Loading/>
            </div>
        );
    };

    
    if (!session) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <HeaderNone />
            <div className="flex justify-center my-8">
                <div className="w-full max-w-[1100px] px-4">
                    <div className="grid lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2 gap-3">
                        {category.map((item) => (
                            <div key={item.category_id}>
                                <Link href={`/category/${item.category_id}`} className="w-[135px] h-[150px] overflow-hidden bg-white flex flex-col rounded-lg items-center justify-center hover:bg-orange-600 focus:bg-yellow-200">
                                    <div className="w-full h-[105px] flex justify-center items-center">
                                        <img src={item.images} alt="category-img" className="rounded-full w-[85px] h-[85px]" />
                                    </div>
                                    <hr />
                                    <div className="w-full h-[45px]">
                                        <p className="text-center text-sm font-semibold">
                                            {item.category_name}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

