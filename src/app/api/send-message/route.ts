import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { Message } from "@/app/models/user.model";

export async function POST(request:NextRequest){
    await connectDB()
    try {
        const {username,content}=await request.json()

        const user=await UserModel.findOne({username})
        if(!user){
            return NextResponse.json({success:false,message:"User not found"},{status:400})
        }

        if(!user.isAcceptingMessage){
            return NextResponse.json({success:false,message:"User is not accepting messages"},{status:403})
        }

        const newMessage={
            content,
            createdAt:new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()

        return NextResponse.json({success:true,message:"Message sent successfully"},{status:200})

    } catch (error) {
        console.log("Error adding messages ")
        return NextResponse.json({success:false,message:"Internal server error"},{status:500})
    }
}