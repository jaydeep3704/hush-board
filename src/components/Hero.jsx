import React from 'react'
import HeroImg from '../assests/hero-img.png'
import Image from 'next/image'
import { Button } from './ui/button'
import { Check, TicketCheck } from 'lucide-react'
const Hero = () => {
  return (
    <div className='py-20 px-[4%] w-full flex md:flex-row  flex-col-reverse items-center md:items-start md:justify-between border-b-2 border-black  bg-gradient-to-b from-neutral-50 to-amber-200'>
     <div className=' md:w-[60%] font-manrope '>
        <h1 className=' font-extrabold text-2xl md:text-4xl leading-normal'>Speak Without Boundaries. <br />Stay Anonymous.</h1>
        <h3 className='font-bold md:text-lg my-5'>Messages, feedback, and questions—directly from you, without anyone knowing who you are.</h3>
        <div className='flex gap-5 mt-10'>
          <Button className='py-5 px-14 text-md md:text-lg bg-accent'>Get Started</Button>
          <Button className='py-5 px-14 text-md md:text-lg'>Learn More</Button>
        </div>
        <div className='flex md:flex-row flex-col gap-5 mt-14 text-sm list-none'>
            <div className='feature-card bg-white shadow-neubrutalism'>
                <h3 className='text-md font-bold'>Complete Anonymity</h3>
                <p className='font-semibold'>
                Share messages, feedback, and questions without revealing your identity.
                </p>
            </div>
            <div className='feature-card bg-white shadow-neubrutalism'>
                <h3 className='text-md font-bold'>Honest Communication</h3>
                <p className='font-semibold'>
                Encourage open and genuine conversations without fear of judgment.
                </p>
            </div>
            <div className='feature-card bg-white shadow-neubrutalism'>
                <h3 className='text-md font-bold'>Effortless Sharing</h3>
                <p className='font-semibold'>
                Instantly send and receive messages using a simple link.
                </p>
            </div>
        </div>
     </div>
     <div className='my-10 md:my-0'>
     <Image src={HeroImg} alt="hfgh" width={400} height={600}/>
     
     </div>
    
    </div>
  )
}

export default Hero
