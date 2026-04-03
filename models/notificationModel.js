import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    userId:{ // jisko notification bheji ho
type:mongoose.Schema.ObjectId,
ref:"User",required:true
    },
    triggeredBy:{type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
       type:{
        type:String,
        enum:["Like","Comment","Follow"],
        required:true
       },postId:{
        type:mongoose.Schema.ObjectId,
        ref:"Post",
        required:true
       },
       commentId:{
        type:mongoose.Schema.ObjectId,
        ref:"Comment"
       },
       isRead:{
        type:Boolean,default:false
       }

    } ,{timestamps:true}
)
const Notification=mongoose.model("Notification",notificationSchema)
export default Notification