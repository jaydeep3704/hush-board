import UserModel from "@/app/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest ,NextResponse} from "next/server";
import connectDB from "@/lib/dbConnect";
import mongoose from "mongoose";
export async function GET(request: NextRequest) {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    const user: User = session.user as User;
    

    if (!user._id) {
        return NextResponse.json({ success: false, message: "Invalid User ID" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    

    try {
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } // Preserve empty messages array
            },
            {
                $sort: { "messages.createdAt": -1 }
            },
            {
                $group: { _id: "$_id", messages: { $push: "$messages" } }
            }
        ]);

        

        if (!user || user.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found or has no messages"
            }, {
                status: 400
            });
        }

        return NextResponse.json({
            success: true,
            messages: user[0].messages
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Aggregation Error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to retrieve messages"
        }, {
            status: 500
        });
    }
}
