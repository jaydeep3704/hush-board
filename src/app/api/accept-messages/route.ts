import UserModel from "@/app/models/user.model";
import connectDB from "@/lib/dbConnect";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
    await connectDB()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 })
        }

        const userId = user._id
        const { acceptMessages } = await request.json()
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true })
        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "Failed to update user status to accept messages" }, { status: 401 })
        }

        return NextResponse.json({ success: true, message: "Message acceptance status updated successfully", updatedUser }, { status: 200 })

    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return NextResponse.json({ success: false, message: "Failed to update user status to accept messages" }, { status: 500 })
    }
}


export async function GET(request: NextRequest) {
    await connectDB()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 })
        }

        const userId = user._id

        const foundUser = await UserModel.findById(userId)
        
        if (!foundUser) {
            return NextResponse.json({ success: false, message: "User Not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, isAcceptingMessage: foundUser.isAcceptingMessage }, { status: 200 })


    } catch (error) {

    
        console.log("Failed to retrieve message acceptance status")
        return NextResponse.json({ success: false, message: "Failed to retrieve message acceptance status" }, { status: 500 })
    }
}

