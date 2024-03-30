import { ApiError } from "../utils/ApiError.js"
import Conversation from "../models/conversation.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = async(req, res)=>{
    try {
        
        const {message} = req.body;
        const  {id : receiverId}= req.params.id;
        const senderId = req.user?._id;

        const conversation =await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: message
        })

        
        if(!newMessage){
            throw new ApiError(500, "Internal Server Error")
        }
        conversation.messages.push(newMessage._id);

        // socket functionality will be here
        
        await conversation.save();
        await newMessage.save();

        res.status(200).json(
            new ApiResponse(201, newMessage, "message sent succesfully")
        )

    } catch (error) {
        throw new ApiError(500, "Internal Server Error")
    }
}

const getMessages = async(req, res)=>{
    try {
        
        const {id: userToChatId} =req.params;
        const senderId = req.user?._id;

        const conversation = await Conversation.findOne({
            participants: {$all:[senderId, userToChatId]}
        }).populate("messages") // not reference but actual message ... Arrays of object of messages

        if(!conversation){
            res.status(200).json(
                new ApiResponse(201, {}, "No conversation has started yet")
            )

        }

        res.status(200).json(
            new ApiResponse(201, conversation.messages, "Messages objects")
        )

    } catch (error) {
        throw new ApiError(500, "Interal server Error")
    }
} 

export{
    sendMessage, getMessages
}