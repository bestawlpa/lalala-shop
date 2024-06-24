'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HeaderNone from "@/components/layout/HeaderNone";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/api/endpoint/route";
import Loading from "../../../app/loading"


export default function Detail({params}){
    const [product,setProduct] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [clickBuyNow ,setClickBuyNow] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const {data: session,status } = useSession();
    const router = useRouter();



    const detailProduct = async () => {
        try {
            const res = await fetch('http://localhost:3000/products/'+params.id);
            const data = await res.json()
            console.log(data);  
            setProduct(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (session) {
            detailProduct();
        }
    }, [session]);

    useEffect(() => {
        if (status === "loading") {
            return;
        } 
        if (!session) {
            router.push(ROUTES.LOGIN);
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

    const increaseQuantity = () => {
        if (selectedQuantity < product.inventory_quantity) {
            setSelectedQuantity(prevQuantity => prevQuantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (selectedQuantity > 1) {
            setSelectedQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleClickBuyNow = () => {
        if(clickBuyNow){
            setClickBuyNow(false)
        } else {
            setClickBuyNow(true)
        }
    };

    const goToNextImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1));
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1));
    };

    const addCart = async () => {
        try {
            const res = await fetch('http://localhost:3000/cartitems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product: product,
                    user: session?.user?._id,
                    quantity: 1,
                }),
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    };

    const renderStars = (ratings) => {
        const numberOfStars = Math.round(ratings);
        const stars = [];

        for (let i = 0; i < numberOfStars; i++) {
            stars.push(<span key={i}>⭐️</span>);
        }

        return stars;
    };
    

    return (
        <div>
            <HeaderNone/>
            <div className=" w-full flex justify-center my-8">
                <div className=" bg-transparent  w-[1000px] flex items-center flex-col" key={product.product_id}>
                    <div className=" w-[90%] h-[380px] bg-white flex justify-between px-5  rounded-lg p-2">
                        {product.images && product.images.length > 0 && (
                            <div className=" flex items-center w-[500px] justify-between ">
                                <button onClick={goToPreviousImage} className=" px-3 py-1 w-[30px] h-[30px] flex items-center justify-center  ">
                                    <span className="">
                                        <ArrowBackIosNewIcon/>
                                    </span>
                                </button>

                                <div>
                                    <img src={product.images[currentImageIndex]} className="w-[400px] h-[300px] hover:scale-160 rounded-xl " />
                                </div>
                                <button onClick={goToNextImage} className=" px-3 py-1 rounded-md w-[30px] h-[30px] flex items-center justify-center">
                                    <span className="">
                                        <ArrowForwardIosIcon/>
                                    </span>    
                                </button>
                            </div>
                        )}

                        <div className=" flex flex-col w-[300px] h-[365px] ">
                            <div className=" ml-4 flex flex-col h-[150px] pt-10 ">
                                <h1>
                                    {product.product_name}
                                </h1>
                                
                                <div className=" flex h-[225px] mt-4">
                                    <p className=" text-red-600 underline">
                                        {product.ratings} 
                                    </p>
                                    <p>
                                        {renderStars(product.ratings)}
                                    </p>
                                </div>
                            </div>

                            <div className=" flex w-full justify-around h-[100px] ">
                                <div className=" m-6 flex w-[300px] justify-between">
                                    <button className=" w-[120px] h-[40px] bg-slate-500 l rounded-lg  focus:bg-red-500" onClick={addCart}>Add Cart</button>
                            
                                    <button className=" w-[120px] h-[40px] bg-red-600  rounded-lg  flex justify-center items-center" onClick={handleClickBuyNow}>buynow</button>
                                </div>
                            </div>  

                            {clickBuyNow&&(
                                <div className=" w-[300px] bg-white  relative -top-[100px]  p-5 flex flex-col justify-center items-center">
                                    <div className=" flex justify-center items-center h-[50px] w-[50px] relative left-[130px]">
                                        <button className=" w-[40px] h-[25px]  text-red-600"  onClick={handleClickBuyNow}><ChevronLeftIcon/></button>
                                    </div>

                                    <div className=" w-[90px] h-[30px]  rounded-md flex justify-center items-center">
                                        <p>stock : <span className="  font-extrabold">{product.inventory_quantity}</span></p>
                                    </div>

                                    <div className=" flex items-center justify-center w-[200px] h-[50px] ">
                                        <button className=" w-[20px] h-[20px] hover:text-red-600  flex justify-center items-center" onClick={decreaseQuantity}>-</button>
                                        <p className=" w-[30px] h-[30px] border-solid border-2 rounded-md border-neutral-500 flex justify-center items-center">{selectedQuantity}</p>
                                        <button className=" w-[20px] h-[20px] hover:text-red-600   flex justify-center items-center" onClick={increaseQuantity}>+</button>
                                    </div>

                                    <div className=" mt-6 w-[80px] h-[30px] bg-red-300 flex justify-center items-center rounded-lg font-bold">
                                        <Link href={`/checkout/${product.product_id}/${selectedQuantity}`}>Buy Now</Link>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                <div className=" bg-white w-[90%] p-3 rounded-lg mt-[40px]">
                    <h1 className=" font-extrabold">Product Specifications</h1>
                    <p className=" font-bold">
                        stock <span className=" text-red-600">:</span> <span className=" font-normal">{product.inventory_quantity}</span>
                    </p>
                    <p className=" font-bold">
                        catagory <span className=" text-red-600">:</span> <span className=" font-normal">{product.category_name}</span>
                    </p>
                    <p className=" font-bold">product rating <span className=" text-red-600">:</span> <span className=" font-normal">{product.ratings}</span></p>
                    <br/>
                    <hr/>
                    <br/>
                    <h1 className=" font-extrabold">Product Description</h1>
                    <p className=" font-normal">
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    </div>
        
    );
};


