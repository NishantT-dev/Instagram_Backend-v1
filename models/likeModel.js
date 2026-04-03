import mongoose from "mongoose";
const likeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    postId:{
        type:mongoose.Schema.ObjectId,
        ref:"Post",
        required:true
    }
},{timestamps:true});

const Like=mongoose.model("Like",likeSchema);
export default Like;