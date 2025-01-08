import connectDB from "@/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import { ApiResponse } from "@/types/apiResponse";
import { signupSchema } from "@/schemas/signupSchema";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:NextRequest):Promise<NextResponse>{
    await connectDB()
    try {
        const reqBody=await request.json()
        const {email,password,username}=reqBody;
        const existingUserVerifiedByUsername=await UserModel.findOne({username,isVerified:true});
        
        if(existingUserVerifiedByUsername)
        {
            return NextResponse.json<ApiResponse>({success:false,message:"Username is already taken"},{status:400})
        }

        const existingUserByEmail=await UserModel.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()
        if(existingUserByEmail){
            
            if(existingUserByEmail.isVerified){
                return NextResponse.json<ApiResponse>({success:false,message:"User already exists with this email"},{status:400})
            }
            else{
         
                const hashedPassword=await bcrypt.hash(password,10)
                existingUserByEmail.verifyCode=verifyCode
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                existingUserByEmail.password=hashedPassword
                await existingUserByEmail.save()
            }
        }
        else{
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser= new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse=await sendVerificationEmail(email,username,verifyCode)

        if(!emailResponse.success){
            return NextResponse.json<ApiResponse>({success:false,message:emailResponse.message},{status:500})
        }

        return NextResponse.json<ApiResponse>({success:true,message:"User registered successfully, Please verify your email"},{status:200})
       
       
    } catch (error) {
        
        return NextResponse.json<ApiResponse>({success:false,message:"User Already exists"})
    }
}