import {ApiError} from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateTokensAndCookie from '../utils/generateTokens.js';

const signUp = async(req, res)=>{
    try {
        const {fullName, gender, userName, password } = req.body;

        if(
            [fullName, userName,gender, password].some((field)=> field?.trim() === "")
        ){
            throw new ApiError(400, " All the fileds are required")
        }

        const user =  await User.findOne({userName})
        if(user){
            throw new ApiError(404, "userName is already existed")
        }

        // hash password here 
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?userName=${userName}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?userName=${userName}`

        const newUser = new User({
            fullName,
            userName,
            gender,
            password: hashPassword,
            profilePic: gender === "male"? boyProfilePic: girlProfilePic
        })

        
        if(!newUser){
            throw new ApiError(500, "Error while creating new user")
        }
        await newUser.save();
        generateTokensAndCookie(newUser?._id, res)

        const createdUser = await User.findById(newUser._id).select(
            "-password -refreshToken"
        )

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered succesfully")
        )


    } catch (error) {
        new ApiError(404, "Something went wrong")
    }
}


const login = async(req, res)=>{
    try {
        
        const {userName, password} = req.body;
        const user = await User.findOne({userName})

        if(!user){
            throw new ApiError(400, "No user exixted")
        }
        const isPasswordCorrect= await bcrypt.compare(password, user?.password)

        if(isPasswordCorrect== false){
            throw new ApiError(404, "PAssword is incorrect")
        }

        generateTokensAndCookie(user?._id, res);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


        res.status(200).json(
            new ApiResponse(201, loggedInUser, "user fetched Successfully")
        )


    } catch (error) {
        new ApiError(404, "Something went wrong")
    }
}

const logout = async(req, res)=>{
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json(
            new ApiResponse(200, {}, "logout succesfully")
        )
    } catch (error) {
        throw new ApiError(500, "internal server error")
    }
}

export {
    login,
    signUp,
    logout
} 