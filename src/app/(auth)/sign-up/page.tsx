"use client";

import { useSession, signIn, signOut } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceValue } from "usehooks-ts"
import { useEffect, useState } from "react";
import { signupSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/apiResponse";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    const debouncedUsername = useDebounceValue(username, 300)
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
            if (debouncedUsername) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const res = await axios.get(`/api/check-username-valid?username=${debouncedUsername}`)
                    setUsernameMessage(res.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error Checking username")
                    toast({
                        title: 'username check failed',
                        description: axiosError.response?.data.message,
                        variant: "destructive"
                    })
                }
                finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsernameUnique()

    }, [])

    return (
        <section className="h-screen w-full flex justify-center items-center font-manrope bg-gradient-to-b from-white to-amber-200">
            <div className="md:w-1/4 w-[80%] flex flex-col gap-5 px-5 py-10 rounded-xl shadow-neubrutalism border-2 border-black bg-white">
                <div className="font-bold text-xl text-center">Sign Up</div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" >
                    <FormField   
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} onChange={(e)=>{
                                        field.onChange(e)
                                        setUsername(e.target.value)
                                    }}/>
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
                    <Button className="mt-5">Sign Up</Button>
                </form>
            </Form>
            </div>
           
        </section>
    )

}