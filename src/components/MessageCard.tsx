import React from 'react'
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
import axios from 'axios'
type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}


const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const {toast}=useToast()
    const handleDeleteConfirm=async()=>{
       const response=await axios.delete<ApiResponse>(`api/delete/${message._id}`)
       toast({
        title:response.data.message
       })
       onMessageDelete(message._id)
    }

    return (
        <Card className='w-1/3 h-[200px] '>
            <CardHeader >
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger>
                        
                        <X className='w-5 h-5'/>
                        
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your message
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>

    )
}

export default MessageCard
