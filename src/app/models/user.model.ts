import mongoose,{Schema,Document}from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message []
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Please use a vaild email address']
    },
    password:{
        type:String,
        required:true,
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"]
    },

    verifyCodeExpiry:{
        type:Date,
        required:true
    },

    messages:[MessageSchema],

    isAcceptingMessage:{
        type:Boolean,
        required:true,
        default:true
    }

})



const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema)


export default UserModel