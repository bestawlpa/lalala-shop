// // pages/checkout/[id]/[quantity]/page.js
'use client'

import HeaderNone from "@/components/layout/HeaderNone"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"

export default function CheckOut({ params }) {
    const [product, setProduct] = useState([]);
    const [address, setAddress] = useState("212 หมู่ 9 ต.ตำบล อ.อำเภอ จ.จังหวัด");
    const [tell, setTell] = useState("08966980988");
    const { data: session } = useSession();

    const getProduct = async () => {
        try {
            const res = await fetch('http://localhost:3000/products/' + params.id);
            const data = await res.json()
            console.log(data);
            setProduct(data);
        } catch (error) {
            console.log(error);
        }
    };

    const sumProduct = () => {
        return product.price * params.quantity
    };

    const calculateTotal = () => {
        const total = sumProduct() + 100;
        return Math.round(total * 100) / 100;
    };

    const handleCheckout = async () => {
        try {
            const res = await fetch('http://localhost:3000/checkouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product: product,
                    user: session?.user?._id,
                    address: address,
                    tell: tell,
                    quantity: params.quantity,
                    total: calculateTotal()
                }),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                // Update product quantity
                const updatedQuantity = product.inventory_quantity - params.quantity;
                const updateRes = await fetch('http://localhost:3000/products/' + params.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inventory_quantity: updatedQuantity,
                    }),
                });

                if (updateRes.ok) {
                    console.log('Product quantity updated successfully');
                } else {
                    const updateError = await updateRes.json();
                    console.log('Failed to update product quantity:', updateError);
                }
            } else {
                console.log('Checkout failed:', data);
            }
        } catch (error) {
            console.log('Error during checkout:', error);
        }
    };

    useEffect(() => {
        getProduct();
    }, []);

    return (
        <div>
            <HeaderNone />
            <div className="w-full flex justify-center my-8">
                <div className="bg-transparent w-[650px] h-[420px] bg-white flex items-center flex-col rounded-md">
                    <div className="h-[220px] w-full flex px-2 justify-around items-center border-b-2 border-gray-300">
                        <div className="w-[200px] h-full flex items-center">
                            {product.images && product.images.length > 0 && (
                                <div>
                                    <img src={product.images[0]} alt="img-product" className="h-[180px] w-[200px]" />
                                </div>
                            )}
                        </div>
                        <div className="w-[300px] h-full px-2 pt-5">
                            <h1>
                                {product.product_name}
                            </h1>
                        </div>
                        <div className="w-[50px] h-full flex items-center justify-center pb-3">
                            * {params.quantity}
                        </div>
                    </div>

                    <div className="w-full h-[100px] border-b-2 border-gray-300 ">
                        <div className="w-full h-[100px] justify-around items-center flex flex-col">
                            <div className="w-full h-[30px] flex justify-between items-center px-[17px]">
                                <h1>Unit Price</h1>
                                <h1 className="pr-4">{sumProduct()}</h1>
                            </div>

                            <div className="w-full h-[30px flex justify-between items-center px-[17px]">
                                <h1>Shipping</h1>
                                <h1 className="pr-4">100</h1>
                            </div>

                            <div className="w-full h-[30px flex justify-between items-center px-[17px] ">
                                <h1>Order Total</h1>
                                <h1 className="pr-4">{calculateTotal()}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[120px] flex flex-row ">
                        <div className="w-[530px] h-[120px] ml-[17px]">
                            <div className="flex items-center h-[50px] mt-2">
                                <h1>Address : </h1>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="address"
                                    className="w-[400px] ml-2 border-2 border-blue-500 rounded-lg p-1" />
                            </div>
                            <div className="flex items-center h-[50px] ml-9 mt-2">
                                <h1>Tell : </h1>
                                <input
                                    type="text"
                                    placeholder="tell"
                                    value={tell}
                                    onChange={(e) => setTell(e.target.value)}
                                    className="w-[200px] ml-2 border-2 border-blue-500 rounded-lg p-1" />
                            </div>
                        </div>
                        <div className="w-[120px] h-[120px] flex justify-center items-end mr-[17px]">
                            <Link href={'/order'} className="w-[100px] h-[40px] bg-red-100 flex items-center justify-center rounded-xl mb-4" onClick={handleCheckout}>checkout</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};


// 'use client'

// import HeaderNone from "@/components/layout/HeaderNone"
// import Link from "next/link";
// import { useState,useEffect } from "react";
// import { useSession } from "next-auth/react"


// export default function CheckOut({params}){
//     const [product,setProduct] = useState([]);
//     const [address, setAddress] = useState("");
//     const [tell, setTell] = useState("");
//     const {data: session } = useSession();

//     const getProduct = async () => {
//         try {
//             const res = await fetch('http://localhost:3000/products/'+params.id);
//             const data = await res.json()
//             console.log(data);  
//             setProduct(data);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const sumProduct = () => {
//         return product.price * params.quantity
//     };

//     const calculateTotal = () =>{
         
//         const total = sumProduct() + 100;
//         return Math.round(total * 100) / 100;
//     };

//     const handleCheckout = async () => {
//         try {
//         const res = await fetch('http://localhost:3000/checkouts', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 product : product,
//                 user: session?.user?._id,
//                 address: address,
//                 tell: tell,
//                 quantity : params.quantity,
//                 total: calculateTotal()
//             }),
//         });
//         const data = await res.json();
//         console.log(data);
//         if (res.ok) {
//                 // Update product quantity
//                 const updatedQuantity = product.inventory_quantity - params.quantity;
//                 const updateRes = await fetch('http://localhost:3000/products/'+params.id, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         quantity: updatedQuantity,
//                     }),
//                 });

//                 if (updateRes.ok) {
//                     console.log('Product quantity updated successfully');
//                 } else {
//                     console.log('Failed to update product quantity');
//                 }
//             } else {
//                 console.log('Checkout failed');
//             }
//     } catch (error) {
//         console.log(error)
//     }
//     };

//     useEffect(() => {
//         getProduct();
//     },[])

//     return(
//         <div>
//             <HeaderNone/>
//             <div className=" w-full flex justify-center my-8">
//                 <div className=" bg-transparent  w-[650px] h-[420px] bg-white flex items-center flex-col rounded-md">
//                     <div className=" h-[220px] w-full flex px-2 justify-around items-center border-b-2 border-gray-300">
//                         <div className=" w-[200px] h-full  flex items-center">
//                             {product.images && product.images.length > 0 && (
//                                 <div>
//                                     <img src={product.images[0]} alt="img-product" className=" h-[180px] w-[200px]"/>
//                                 </div>
//                         )}
//                         </div>
//                         <div className=" w-[300px] h-full   px-2 pt-5">
//                             <h1>
//                                 {product.product_name}
//                             </h1>
//                         </div>
//                         <div className="  w-[50px] h-full  flex items-center justify-center pb-3">
//                             * {params.quantity}
//                         </div>
//                     </div>
                    
                    
//                     <div className=" w-full h-[100px] border-b-2 border-gray-300 ">
//                         <div className=" w-full h-[100px] justify-around items-center  flex flex-col">
//                             <div className=" w-full h-[30px] flex justify-between items-center px-[17px]">
//                                 <h1>Unit Price</h1>
//                                 <h1 className=" pr-4">{sumProduct()}</h1>
//                             </div>
                            
//                             <div className=" w-full h-[30px flex justify-between items-center px-[17px]">
//                                 <h1>Shipping</h1>
//                                 <h1 className=" pr-4">100</h1>
//                             </div>

//                             <div className=" w-full h-[30px flex justify-between items-center px-[17px] ">
//                                 <h1>Order Total</h1>
//                                 <h1 className=" pr-4">{calculateTotal()}</h1>
//                             </div>
//                         </div>
//                     </div>

//                     <div className=" w-full h-[120px] flex flex-row ">
//                             <div className=" w-[530px] h-[120px] ml-[17px]">
//                                 <div className=" flex items-center h-[50px] mt-2">
//                                     <h1>Address : </h1>
//                                     <input 
//                                     type="text" 
//                                     value={address}
//                                     onChange={(e) => setAddress(e.target.value)} 
//                                     placeholder="address" 
//                                     className=" w-[400px]  ml-2 border-2 border-blue-500 rounded-lg p-1"/>
//                                 </div>
//                                 <div className=" flex items-center h-[50px] ml-9 mt-2">
//                                     <h1>Tell : </h1>
//                                     <input 
//                                     type="text" 
//                                     placeholder="tell" 
//                                     value={tell}
//                                     onChange={(e) => setTell(e.target.value)}
//                                     className=" w-[200px] ml-2 border-2 border-blue-500 rounded-lg p-1"/>
//                                 </div>
                                
                                
//                             </div>
//                             <div className=" w-[120px] h-[120px]  flex justify-center items-end mr-[17px]">
//                                 <Link href={'/'} className=" w-[100px] h-[40px] bg-red-100 flex items-center justify-center rounded-xl mb-4" onClick={handleCheckout}>checkout</Link>
//                             </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     )
// };
