import { NextRequest,NextResponse } from "next/server";
import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/dbConnect";

export async function POST(request:NextRequest){
    await connectDB()    
    try 
    {
        const requestBody=await request.json()
        const {OTP,username}=requestBody
        const user=await UserModel.findOne({username})

        if(!user){
            return NextResponse.json({success:false,message:"User not found"},{status:400})
        }

        if( user.isVerified){
            return NextResponse.json({success:false,message:"User already verified Please Login"},{status:400})
        }


        const isOTPValid= OTP===user.verifyCode
        const isVerifyCodeExpired= new Date() > user.verifyCodeExpiry

        if(isOTPValid && !isVerifyCodeExpired)
        {
            user.isVerified=true
            user.save()
            return NextResponse.json({success:true,message:"Account verified successfully"},{status:200})
        }
        else if(isOTPValid && isVerifyCodeExpired){
            return NextResponse.json({success:false,message:"verification code has expired please signup again to get new code"},{status:400})
        }
        else{
            return NextResponse.json({success:false,message:"Incorrect verification code"},{status:500})
        }

    } 
    catch (error) {
        console.error("An error occurred while verifying code")
        return NextResponse.json({success:false,message:"An error occurred while verifying OTP"},{status:500})        
    }
}