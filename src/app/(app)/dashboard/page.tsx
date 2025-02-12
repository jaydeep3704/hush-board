"use client";

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import MessageCard from '@/components/MessageCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/app/models/user.model';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { toast } from '@/hooks/use-toast';
import { User } from 'next-auth';
import { Copy, Loader2, RefreshCcw } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';

const page = () => {

  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  })

  const { handleSubmit, control, watch, setValue, register } = form
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => {
      return message._id !== messageId
    }))
  }
  const acceptMessages = watch('acceptMessages')


  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get("/api/accept-messages")
      setValue('acceptMessages', response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({ title: "Error", description: axiosError.response?.data.message || "Failed to fetch Message settings" })
    }
    finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: "showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({ title: "Error", description: axiosError.response?.data.message || "Failed to fetch Message settings" })
    }
    finally {
      setIsSwitchLoading(false)
      setLoading(false)
    }

  }, [setLoading, setMessages])

  //handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessages })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({ title: "Error", description: axiosError.response?.data.message || "Failed to fetch Message settings" })
    }
    finally {
      setIsSwitchLoading(false)
    }
  }




  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  if (!session || !session.user) {
    return <div></div>
  }

  const { username } = session.user as User
  const baseURL = `${window.location.protocol}/${window.location.host}`
  const profileURL = `${baseURL}/u/${username}`


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL)
    toast({ title: 'URL Copied', description: 'profile url has been copied to clipboard' })
  }


  return (
    <section className='px-[4%] py-10 h-[calc(100vh-80px)] dark:bg-saas-background'>
      <h1 className=" text-4xl dark:text-text-1">
        User Dashboard.
      </h1>

      <div className='md:w-[60%] w-full'>
        <div className='mt-5  rounded-full overflow-hidden flex items-center py-2 border dark:bg-saas-foreground  px-4 border-black'>
          <input type="text" className='w-full py-2 bg-transparent outline-none' disabled value={profileURL} />
          <Copy className='cursor-pointer' onClick={copyToClipboard} />
        </div>
        <p className='text-sm mt-4 font-semibold text-text-2'>Share this URL with others to gather their feedback.</p>
      </div>

      <div className="my-5">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <div >
        <MessageCard/>
      </div>

      
    </section>
  )
}

export default page
