import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/app/models/user.model";

export async function DELETE(request:NextRequest,{ params }: { params:Promise<{id:string}>}){
    await connectDB()
    const session=await getServerSession(authOptions)
    const user=session?.user as User
    const newParams=await params
    const {id}=newParams


    if(!session || !session.user){
        return NextResponse.json({success:false,message:"Not Authenticated"},{status:401})
    }

    try {
            const updatedResult=await UserModel.updateOne({_id:user._id},{$pull:{messages:{_id:id}}})

            if(updatedResult.modifiedCount==0){
                return NextResponse.json({success:false,message:"Failed to Update Message Array"},{status:404})
            }

           return NextResponse.json({success:true,message:"Message Deleted"},{status:200})


        
    } catch (error) {
        return NextResponse.json({success:false,message:"Failed to Delete Message"},{status:500})
    }
    


}