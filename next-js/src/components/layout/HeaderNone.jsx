import Link from "next/link"
import Image from "next/image";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useSession } from "next-auth/react"



export default function HeaderNone(){
    const {data: session } = useSession();
    return(
        <header className="bg-[#F4F4F4] flex items-center justify-center w-full">
            <nav className="flex min-h-28 justify-between items-center font-black w-[1280px] min-w-[375px] text-[#31363F] ">
                <div className=" w-[426px]"> 
                    <Link href={"/"} className="flex items-center gap-1">
                        <Image src={'/logonew.png'} width={150} height={100} alt="logo" style={{ objectFit: 'cover' }}></Image>
                        <h2 className="text-4xl hover:text-[#CCEABB]">LALALA</h2>
                    </Link>
                </div>
                
                <div className="flex gap-4 text-lg items-end w-[426px] ">
                    <Link href="/" className="flex justify-center items-center w-[70px] h-[35px] hover:bg-slate-400 transition-all duration-2000 ease-in-out hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">HOME</Link>
                    <Link href="/shop" className="flex justify-center items-center w-[70px] h-[35px] hover:bg-slate-400 hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">SHOP</Link>
                    <Link href="/cart" className="flex justify-center items-center w-[50px] h-[35px] hover:bg-slate-400 hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out"><ShoppingCartIcon/></Link>
                    {session?.user ? (
                        <Link href="/profile" className={`flex justify-center items-center w-[${session.user.username.length * 15}px] h-[35px] px-2 hover:bg-slate-400 hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out uppercase`}>{session.user.username}</Link>
                    ) : (
                        <Link href="/profile" className="flex justify-center items-center w-[90px] h-[35px] hover:bg-slate-400 hover:rounded-xl hover:transition-all hover:duration-9000 hover:ease-in-out">PROFILE</Link>
                    )}
                </div>
            </nav>
        </header>
    )
};