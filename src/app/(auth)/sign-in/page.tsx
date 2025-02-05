"use client";

import { useSession, signIn, signOut } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {useDebounceValue} from "usehooks-ts"
import { useEffect, useState } from "react";
import { signupSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/apiResponse";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
   const [username,setUsername]=useState('')
   const[usernameMessage,setUsernameMessage]=useState('')
   const [isCheckingUsername,setIsCheckingUsername]=useState(false)
   const[isSubmitting,setIsSubmitting]=useState(false)

   const form=useForm<z.infer<typeof signupSchema>>({
    resolver:zodResolver(signupSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    },
    
   })
   

   const{toast}=useToast()
   const debouncedUsername=useDebounceValue(username,300)
   const router=useRouter()
   const onSubmit=async (data:z.infer<typeof signupSchema>)=>{
    setIsSubmitting(true)
    try {
      const response=await axios.post("/api/sign-up",data)
      if(response.data.success){
        toast({
          title:'Signup Sucessful',
          description:response.data.message
        })
        router.replace(`/verify/${username}`)
      }
      else{
        toast({
          title:'Signup failed',
          description:response.data.message
        })
      }
    } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>
          const errorMessage=axiosError.response?.data.message 
          toast({
            title:'Signup failed',
            description:errorMessage,
            variant:"destructive"
          })
        }
        finally{
          setIsSubmitting(false)
        }

   }


   useEffect(()=>{

    const checkUsernameUnique=async()=>{
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const res=await axios.get(`/api/check-username-valid?username=${debouncedUsername}`)   
          setUsernameMessage(res.data.message)
        } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error Checking username")
          toast({
            title:'username check failed',
            description:axiosError.response?.data.message,
            variant:"destructive"
          })
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnique()
      
   },[debouncedUsername])

   return(
    <div>Sign In </div>
   )
  
}