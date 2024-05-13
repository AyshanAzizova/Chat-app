import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { generateTokenAndSetCookie } from '../generateTokenAndSetCookie.js';

export const signup = async (request, response) => {
    const {
        userName,
        fullName,
        password,
        confirmPassword,
        gender,
        profilePicture
    } = request.body

    // Check empty fields
    if (!userName || !fullName || !password || !confirmPassword || !gender || !profilePicture) {
        return response.status(404).send({
            error: "Please fill all required fields"
        })
    }
    // Check confirmPassword
    if (confirmPassword !== password) {
        return response.status(404).send({
            error: "Password and confirm Password don't match"
        })
    }
    // Check if userName already exists
    const existingUser = await User.findOne({
        userName
    })
    if (existingUser) {
        return response.status(404).send({
            error: "UserName already exist"
        })
    }
    // HASH the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        userName,
        fullName,
        password: hashedPassword,
        gender,
        profilePicture
    })
    if (!newUser) {
        return response.status(404).send({
            error: "User not created"
        })
    }
    generateTokenAndSetCookie(newUser._id,response)
    response.status(201).send(newUser)
};

export const signin = async (request, response) => {
    const {
        userName,
        password
    } = request.body

    // Check empty fields
    if (!userName || !password) {
        return response
            .status(404).send({
                error: "Please fill all required fields"
            })
    }

    const user = await User.findOne({
        userName
    })

    let isCorrectPassword;

    // Check password is correct
    if (user) {
        isCorrectPassword = await bcrypt.compare(password, user?.password)

    }
    if (!isCorrectPassword || !user) {
        return response.status(404).send({
            error: "Incorrect password or username"
        })
    }
    generateTokenAndSetCookie(user._id,response)
    response.status(200).send(user)
};

export const logout = async (request, response) => {
    response.cookie("jwt","");
    response.status(200).send({message:"Logged out successfully"})

};