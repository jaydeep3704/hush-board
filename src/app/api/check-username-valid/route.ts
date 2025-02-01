import {z} from "zod"
import UserModel from "@/app/models/user.model"
import connectDB from "@/lib/dbConnect"
import { validateUsername } from "@/schemas/signupSchema"
import { signupSchema } from "@/schemas/signupSchema"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export  async function GET(request:NextRequest){
    await connectDB()
    try {
        const searchParams=request.nextUrl.searchParams
        const queryParams={
            username:searchParams.get('username')
        }
        const usernameQuerySchema=z.object({
            username:validateUsername
        })
        const result=usernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const username_errors=await result.error.format().username?._errors || []
            return NextResponse.json({success:false,message:username_errors.length>0?username_errors.join(','):"Invalid Query Parameters"},{status:400})
        }
        const {username}=result.data
    
        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})
        
        if(existingVerifiedUser){
            return NextResponse.json({success:false,message:"user already exists"},{status:400})    
        }
        return NextResponse.json({success:true,message:"username available"},{status:200})
    } catch (error) {
        console.error("Error checking username")
        return NextResponse.json({success:false,message:"Error checking username"},{status:500})
    }
}