import { GoogleGenerativeAIError } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { ServerResponse } from "http";
export async function POST(request: NextRequest) {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",systemInstruction:"Act like a person who is asking questions to a person"});

        const prompt="Create a list of three open-ended engaging questions formatted as a single string .Each question should be seperated by '||'. These questions are for an anonymous messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focus instead on universal themes that encourage friendly interaction. For example the output should be structured like this 'What`s a hobby that you`ve recently started ?||If you could have dinner with any historical figure,who it could be ?'.Ensure the questions are intriguing foster curiosity, and contribute to a positive and welcoming environment"

        const result = await model.generateContent(prompt);
        if(!result){
            return NextResponse.json({success:false,message:"Error in generating message"},{status:400})
        }
 
          return NextResponse.json({success:true,result:result.response.text()},{status:200})
    } catch (error) {
        if(error instanceof GoogleGenerativeAIError){
            console.log(error)
        }
        return NextResponse.json({success:false,message:"Internal Server Error"},{status:500})
    }
}