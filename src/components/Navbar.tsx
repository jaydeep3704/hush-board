"use client";

import React from 'react'
import {Menu} from "lucide-react"
import { Button } from './ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import ModeToggle from '@/components/ModeToggle'
const Navbar = () => {
    const { data: session, status } = useSession()
    const user:User=session?.user as User
    return (
        <nav className='flex h-[80px] items-center justify-between px-[4%] border-b-[0.5px] dark:border-neutral-800'>
            <h2 className='text-xl dark:text-white'>HushBoard</h2>
            <div><ModeToggle/></div>
        </nav>
    )
}

export default Navbar
