import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
    required: true,
  },
  replyBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true }, text:{
    type:String,
    required:true
  },isDeleted:{
    type:Boolean,default:false
  }
},{timestamps:true});

const Reply=mongoose.model("Reply",replySchema);
export default Reply