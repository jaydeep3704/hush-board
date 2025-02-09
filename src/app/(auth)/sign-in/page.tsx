"use client";

import { useSession, signIn, signOut } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {  useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signInSchema } from "@/schemas/signinSchema";
import { ArrowRightIcon, Loader2 } from "lucide-react";


export default function Page() {
    
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        },

    })


    const { toast } = useToast()
    
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
       const result=await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
       })
       console.log(result,data)
       if(result?.error){
        toast({
            title:"Login Failed",
            description:"Incorrect username or password"
        })
       }
       
       if (result?.url) {
        router.replace('/dashboard');
      }
       
       setIsSubmitting(false)
    }


    

    return (

        <section className="min-h-screen w-full flex justify-center items-center dark bg-black ">
            <div className="max-w-md w-full mx-auto  rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black
             border-[0.5px] dark:border-neutral-700
            ">

                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center mt-5">
                    Welcome to HushBoard
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 my-8 " >
                        
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username or email" {...field}  />
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
                           {isSubmitting?<Loader2 className="animate-spin"/>:<div className="flex gap-3 items-center">Sign In <ArrowRightIcon className="h-[18px] w-6"/> </div>} 
                            <BottomGradient />
                        </button>
                        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-5 h-[1px] w-full" />

                        <p className=" text-sm text-neutral-800 dark:text-neutral-500 text-center mt-3">
                        Don't have an account ? <Link href={"/sign-up"} className="dark:hover:text-white">Sign Up</Link>
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