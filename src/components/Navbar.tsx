import React from 'react'
import {Menu} from "lucide-react"
import { Button } from './ui/button'
import Link from 'next/link'
const Navbar = () => {
    return (
        <section className=''>

            <div className='flex justify-between  bg-white px-[4%] h-[80px] items-center font-manrope border-b-2 border-black '>
                <div className='md:text-xl text-lg  font-bold py-2 px-5'>
                    HushBoard
                </div>
                <ul className=' list-none gap-5 md:text-md hidden md:flex font-semibold'>
                    <li>Home</li>
                    <li>Features</li>
                    <li>About us</li>
                </ul>

                <ul className='flex list-none gap-5 md:gap-10 md:text-md items-center '>
                    <Link href={'/sign-in'} className='font-semibold cursor-pointer'>Login</Link>
                    <Button className='md:flex hidden  bg-black text-white rounded-2xl '>Send A Message</Button>
                    <Menu className='w-5 h-5 md:hidden'/>
                </ul>

               
            </div>
            <div className='md:hidden   h-full items-end p-10 text-lg w-full' >
                <ul className='w-full flex flex-col '>
                    <li className='py-3 border-b border-black'>Home</li>
                    <li className='py-3 border-b border-black'>Features</li>
                    <li className='py-3 border-b border-black'>About us</li>
                    <li className='py-3 border-b border-black'>Send a message</li>
                </ul>
            </div>
        </section>
    )
}

export default Navbar
