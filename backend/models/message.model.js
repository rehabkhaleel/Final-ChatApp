import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recieverID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true,
        default:[]
    }
    //created at, updated at
},{timestamps:true});


const Message = mongoose.model("Message",messageSchema);

export default Message;