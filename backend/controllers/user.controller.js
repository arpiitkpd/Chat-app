import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const getUsersForSidebar = async(req, res)=>{

    try {

        const loggedInUserId= req.user?._id;
        const filteredUsers = await User.find({_id:{
            $ne: loggedInUserId
        }}).select("-password")

        if(!filteredUsers){
            return res.status(200).json(
                new ApiResponse(200, {}, "No logged in user found")
            )
        }

        res.status(200).json(
            new ApiResponse(200, filteredUsers, "users fetched Succesfully")
        )

        
    } catch (error) {
        throw new ApiError(500, "Internal Server error")
    }

}
export{
    getUsersForSidebar
}