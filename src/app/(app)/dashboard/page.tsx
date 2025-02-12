"use client";

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import MessageCard from '@/components/MessageCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/app/models/user.model';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { toast } from '@/hooks/use-toast';
import { User } from 'next-auth';
import { Copy, Loader2, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
    <section className='px-[8%] py-10 dark:bg-saas-background h-[calc(100vh-80px)] '>
      <h1 className=" text-4xl dark:text-neon-green">
        User Dashboard.
      </h1>

      <div className=' w-full mt-5'>
        <div className='text-lg font-semibold'>Copy your unique link</div>
        <div className='mt-3  rounded-full overflow-hidden flex items-center py-2 border dark:bg-saas-foreground bg-[#FAFAFA] px-4 dark:border-none'>
          <input type="text" className='w-full py-2 bg-transparent outline-none' disabled value={profileURL} />
          <Copy className='cursor-pointer' onClick={copyToClipboard} />
        </div>
      </div>

      <div className="my-5">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-primary">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <Separator className='dark:bg-neutral-800 bg-neutral-300'/>

      <div className='mt-10'>
        <Button className='dark:bg-neon-green'><RefreshCcw/></Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
       
      </div>

      
    </section>
  )
}

export default page
