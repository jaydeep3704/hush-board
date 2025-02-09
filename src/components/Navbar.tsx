"use client";

import React from 'react'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import ModeToggle from '@/components/ModeToggle'
import Link from 'next/link';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';



const Navbar = () => {
    const { data: session, status } = useSession()
    const user:User=session?.user as User
    const router=useRouter()
    const handleLogout=async ()=>{
        await signOut()
        router.replace('/sign-in')
    }


    return (
        <nav className='flex w-full   h-[80px] items-center justify-between px-[4%] border-b-[0.5px] dark:border-neutral-800'>
            <h2 className='text-xl dark:text-white '>HushBoard</h2>
            {session && <div className='md:block hidden'>
                Welcome, <span className=' text-md font-semibold text-blue-500'>{user.username || user.email}</span>
            </div>}
            
            <ul className='flex gap-5 items-center'>
              {status!="authenticated" ? <Link href={'/sign-in'} >Login</Link>:<Button onClick={handleLogout} className='shadow-none text-md'>Logout</Button>}
              <div><ModeToggle/></div>  
            </ul>
           
        </nav>
    )
}

export default Navbar
