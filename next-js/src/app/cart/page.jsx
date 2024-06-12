'use client'       

import { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Link from "next/link";
import HeaderNone from "@/components/layout/HeaderNone";
import { useSession } from "next-auth/react";
import { ROUTES } from "../api/endpoint/route";
import { useRouter } from "next/navigation";
import Loading from "../loading";

export default function Cart() {
    const { data: session,status } = useSession();
    const [products, setProducts] = useState([]);
    const router = useRouter(); 

    useEffect(() => {
        if (status === "loading") {
            return;
        } 
        if (!session) {
            router.push(ROUTES.LOGIN);
        }

        if (session) {
            const userId = session.user._id;
            const getProducts = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/cartitems/user/${userId}`);
                    const data = await res.json();
                    // เรียกใช้ฟังก์ชัน setInitialQuantity เมื่อได้ข้อมูลสินค้าเรียบร้อยแล้ว
                    setProducts(data.map(cartItem => setInitialQuantity(cartItem)));
                } catch (error) {
                    console.log(error);
                }
            };
            getProducts();
        }
        
    }, [session,status]);

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

    // ฟังก์ชันสำหรับตั้งค่าจำนวนเริ่มต้นให้เป็น 1
    

    const removeFromCart = async (cartId) => {
        try {
            const response = await fetch(`http://localhost:3000/cartitems/${cartId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setProducts(prevProducts => prevProducts.filter(item => item._id !== cartId));
            } else {
                console.error('Failed to delete product from cart');
            }
        } catch (error) {
            console.error('Error deleting product from cart:', error);
        }
    };

    const setInitialQuantity = (cartItem) => {
        console.log('cartite,m',cartItem)
        return {
            ...cartItem,
            product: cartItem.product.map(prod => ({
                ...prod,
                selectedQuantity: 1 // ตั้งค่าจำนวนเริ่มต้นให้เป็น 1
            }))
        };
    };

    const increaseQuantity = (cartId, productId) => {
        setProducts(prevProducts => prevProducts.map(item => {
            if (item._id === cartId) {
                return {
                    ...item,
                    product: item.product.map(prod => {
                        if (prod._id === productId) {
                            const newQuantity = prod.selectedQuantity + 1;
                            return {
                                ...prod,
                                selectedQuantity: Math.min(newQuantity, prod.inventory_quantity) // ตั้งค่าให้ไม่เกินจำนวนสินค้าในสต็อก
                            };
                        }
                        console.log('prod',prod);
                        return prod;
                    })
                };
            }
            console.log('item',item);
            return item;
        }));
    };

    const decreaseQuantity = (cartId, productId) => {
        setProducts(prevProducts => prevProducts.map(item => {
            if (item._id === cartId) {
                return {
                    ...item,
                    product: item.product.map(prod => {
                        if (prod._id === productId) {
                            const newQuantity = prod.selectedQuantity - 1;
                            return {
                                ...prod,
                                selectedQuantity: Math.max(newQuantity, 1) // ตั้งค่าให้ไม่น้อยกว่า 1
                            };
                        }
                        return prod;
                    })
                };
            }
            return item;
        }));
    };

   

    return (
        <div>
            <HeaderNone/>
            <div className="flex justify-center items-center flex-col my-4">
                {products.map((cartItem) => (
                    <div key={cartItem._id} className="w-[600px] h-[200px] my-4 flex justify-between rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-[#EEEEEE]">
                            {cartItem.product.map((item) => (
                                <div key={item._id} className="flex flex-row justify-between">
                                    <div className="w-[200px] h-[200px]">
                                        {item.images && item.images.length > 0 && (
                                            <img src={item.images[0]} alt="img-product" className="w-[200px] h-[200px]" />
                                        )}
                                    </div>
                                    <div className="w-[300px] h-[200px] mt-2 mr-3 ">
                                        <div className=" h-[60px] w-[300px] ">
                                            <Link href={'/detail/' + item.product_id} className="hover:text-red-600 font-bold" >{item.product_name}</Link>
                                        </div>
                                        
                                        
                                        <div className=" flex items-center justify-center w-[270px] h-[50px] mt-2">
                                            <button className=" w-[20px] h-[20px]   rounded-lg flex justify-center items-center" onClick={() => decreaseQuantity(cartItem._id, item._id)}>-</button>
                                            <p className=" w-[30px] h-[30px] bg-white border-solid border-2 border-neutral-500 rounded-md flex justify-center items-end">{item.selectedQuantity}</p>
                                            <button className=" w-[20px] h-[20px]  flex justify-center items-center" onClick={() => increaseQuantity(cartItem._id, item._id)}>+</button>
                                        </div>

                                        <div className=" w-[270px] h-[30px] flex justify-center items-center m">
                                            <p>
                                                stock : <span className="  font-extrabold">{item.inventory_quantity}</span>
                                            </p>
                                        </div>
                                        <div className=" mt-1 w-[270px] flex justify-center h-[50px]">
                                            <Link className="w-[80px] h-[30px] bg-red-500 text-white flex justify-center items-center rounded-lg font-bold" href={`/checkout/${item.product_id}/${item.selectedQuantity}`} onClick={() => removeFromCart(cartItem._id)}>Buy Now</Link>
                                        </div> 

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-[80px] h-full bg-white flex items-center justify-center">
                            <button className=" text-red-600 hover:text-black " onClick={() => removeFromCart(cartItem._id)}><DeleteIcon/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



