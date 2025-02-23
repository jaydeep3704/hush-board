"use client"

import React from 'react'
import dayjs from 'dayjs';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from 'lucide-react'
import { Button } from './ui/button'

import { Message } from '@/app/models/user.model'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/apiResponse'
import axios, { AxiosError } from 'axios'
type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: any) => void
}


const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const {toast}=useToast()
    const handleDeleteConfirm = async () => {
        try {
          const response = await axios.delete<ApiResponse>(
            `/api/delete-message/${message._id}`
          );
          toast({
            title: response.data.message,
          });
          onMessageDelete(message._id);
    
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ?? 'Failed to delete message',
            variant: 'destructive',
          });
        } 
      };
    return (
        <Card className='w-full h-[150px] dark:bg-saas-foreground dark:border-none '>
            <CardHeader >
               <div className='flex flex-row justify-between'>
              
                <CardTitle className='text-lg md:text-2xl font-semibold'>{message.content}</CardTitle>
                <AlertDialog >
                    <AlertDialogTrigger className='dark:bg-neon-green py-1.5 px-3 rounded-md bg-neon-orange text-white'>
                        
                        <X className='w-5 h-5' />
                        
                    </AlertDialogTrigger>
                    <AlertDialogContent className='dark:bg-saas-foreground border-none bg-white'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your message
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className='dark:bg-red-600 border-none bg-neon-orange text-white'>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} className='dark:bg-neon-green bg-light-primary text-white'>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div> 
            <div className='text-sm'>
              {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
            </CardHeader>

        </Card>

    )
}

export default MessageCard
