import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import connectDB from "@/lib/dbConnect";
import UserModel from "@/app/models/user.model";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await connectDB()
                
                try {


                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("Invalid Credentials")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before signing in")
                    }


                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Password is Incorrect")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        }),

    ],
    callbacks: {

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString()
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        }
    },

    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET,

}
