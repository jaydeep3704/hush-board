"use client";
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@react-email/components';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2 } from 'lucide-react';



const page = () => {

    const router = useRouter()
    const params = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })
    const[isSubmitting,setIsSubmitting]=useState<boolean>(false)


    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        
        try {
            const response = await axios.post(`/api/verify-code`, { username: params.username, verifyCode: data.code })
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
                title: 'Verification Failed',
                description: errorMessage,

            })
        }
    }

    return (
        <div className='min-h-screen dark:bg-black flex w-full justify-center items-center'>
            <div className="max-w-[400px] w-full my-5 mx-auto  rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black
             border-[0.5px] dark:border-neutral-800
            ">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center mt-5">
                    Verify your Email
                </h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=' mt-8 space-y-6 '>
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem >
                                    
                                    <FormControl className='w-full '>
                                    
                                        <InputOTP maxLength={6}  {...field} >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                        
                                        
                                        


                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <button
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 flex dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-4 items-center justify-center"
                            type="submit"
                        >
                           {isSubmitting?<Loader2 className="animate-spin"/>:<div className="flex gap-3 items-center">Verify</div>} 
                            <BottomGradient />
                        </button>

                    </form>
                </Form>
                <p className='dark:text-neutral-400 text-sm text-center mt-4'>Check the verification code sent to your email</p>
            </div>

        </div>
    )
}

export default page



const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};