import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";


export const sendVerificationEmail=async(email:string,username:string,verifyCode:string):Promise<ApiResponse>=>{
        try {
            const { data, error } = await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: email,
                subject: 'HushBoard | Verification Code ',
                react: VerificationEmail({username,otp:verifyCode}),
              });
          

            return {success:true,message:"Verification email sent successfuly"}
        } catch (emailError) {
            console.error("Error sending verification email : ",emailError)
            return {success:false,message:"Failed to send verification Email"}
        }
}