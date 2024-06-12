'use client'
import HeaderNone from "@/components/layout/HeaderNone";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function PayNow({ params }) {
    const [order, setOrder] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    console.log('order', order);
    const router = useRouter();

    const getOrder = async () => {
        try {
            const res = await fetch(`http://localhost:3000/checkouts/${params.id}`);
            const data = await res.json();
            console.log('data', data);  
            setOrder(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const image = event.target.image.files[0];
        formData.append('image', image);
        formData.append('order', JSON.stringify(order)); // เพิ่มข้อมูล order ลงใน FormData

        try {
            const res = await fetch('http://localhost:3000/receipts/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Upload successful:', data);

                // อัปเดตสถานะการอัปโหลด
                setUploadStatus('Upload completed. Waiting for verification.');

                // รอเวลาสักครู่ก่อนที่จะเปลี่ยนเส้นทาง
                setTimeout(() => {
                    router.push('/order');
                }, 2000); // รอ 2 วินาที
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div>
            <HeaderNone />
            <div className="flex justify-center items-center mt-8">
                {order && order.product && order.product.map((item) => (
                    <div key={order._id} className="w-[600px] h-[220px] p-4 bg-white rounded-md overflow-hidden flex">
                        <div className="w-[250px] flex justify-center items-center">
                            <img src="https://c1.img2qr.com/images/simple_qrcode.png?x-oss-process=image/quality,Q_80" alt='qr' className="w-[180px] h-[180px]" />
                        </div>
                        
                    

                        <div className="w-[350px]  relative ">
                            <form onSubmit={handleSubmit} className=" flex flex-col justify-center items-center">
                                <div className="mt-2">
                                    <h1 className="font-extrabold">Order : <span className="font-normal">{order._id}</span></h1>
                                    <h2 className="font-extrabold">Total : <span className="font-normal">{order.total}</span></h2>
                                </div>

                                <div className="w-[400px] my-2 flex justify-center mt-2">
                                    <input type="file" accept=".jpg, .jpeg, .png" id="image" name="image" className=" bg-slate-400 py-1 px-2 w-[300px] h-[38px] rounded-lg" required/>
                                </div>

                                <div className=" w-[300px] h-[40px] 0 flex justify-center mt-2">
                                    <button type="submit" className=" h-[35px] w-[80px] bg-red-500 rounded-lg" >Submit</button>
                                </div>
        
                                {uploadStatus && (
                                    <div className="absolute top-[85px] right-0 w-[355px] h-[210px] flex justify-center items-center bg-white" style={{ transform: 'translateY(-50%)' }}>
                                        <p>{uploadStatus}</p>
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};
