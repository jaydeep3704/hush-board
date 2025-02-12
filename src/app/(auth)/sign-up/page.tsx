"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback } from "usehooks-ts"
import { useEffect, useState } from "react";
import { signupSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/apiResponse";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowRight, ArrowRightFromLine, ArrowRightIcon, Loader2 } from "lucide-react";

export default function Page() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },

    })


    const { toast } = useToast()
    const debounced = useDebounceCallback(setUsername, 300)
    const router = useRouter()
    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post("/api/sign-up", data)
            if (response.data.success) {
                toast({
                    title: 'Signup Sucessful',
                    description: response.data.message
                })
                router.replace(`/verify/${username}`)
            }
            else {
                toast({
                    title: 'Signup failed',
                    description: response.data.message
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
                title: 'Signup failed',
                description: errorMessage,
                variant: "destructive"
            })
        }
        finally {
            setIsSubmitting(false)
        }

    }


    useEffect(() => {

        const checkUsernameUnique = async () => {
            if (username){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const res = await axios.get(`/api/check-username-valid?username=${username}`)
                    setUsernameMessage(res.data.message)
                    if(res.data.success){
                        toast({
                            title:res.data.message
                        })
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error Checking username")
                    toast({
                        title: 'username check failed',
                        description: axiosError.response?.data.message,
                        variant:'default'
                    })
                }
                finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsernameUnique()

    }, [username])

    return (

        <section className="min-h-screen w-full flex justify-center items-center dark:bg-black ">
            <div className="max-w-md w-full my-5 mx-auto  rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black
             border-[0.5px] dark:border-neutral-800
            ">

                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center mt-5">
                    Welcome to HushBoard
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 my-8 " >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <button
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 flex dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-4 items-center justify-center"
                            type="submit"
                        >
                           {isSubmitting?<Loader2 className="animate-spin"/>:<div className="flex gap-3 items-center">Sign Up <ArrowRightIcon className="h-[18px] w-6"/> </div>} 
                            <BottomGradient />
                        </button>
                        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-5 h-[1px] w-full" />

                        <p className=" text-sm text-neutral-800 dark:text-neutral-500 text-center mt-3">
                        Already have an account ? <Link href={"/sign-in"} className="hover:text-white">Sign In</Link>
                        </p>
                    </form>
                </Form>
            </div>
        </section>
    )

}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};