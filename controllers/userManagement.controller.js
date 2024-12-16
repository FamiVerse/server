import express from "express"
import User from "../models/User.js"
import Invitation from "../models/Invites.js"
import {transporter} from "../utils/gmail.config.js"
import bcryptjs from "bcryptjs"
import crypto from "crypto"



const salt = 10

/**
 * GET /Users
 */
export const users = async(req,res)=>{
  try {
    const allUsers = await User.find({})
    res.status(200).json({success:true, allUsers})

  } catch (error) {
    res.status(500).json({success:false, message:error.message})
  }
}

/**
 * 
 * @param {Update User} req 
 
 */

 export const updateUser = async(req,res)=>{
    try {
        const {email, ...keysToUpdate} = req.body
        if(Object.keys(keysToUpdate).length === 0 && !email)
            return res.status(400).json({success:false, message:"No data to update"})
        // if(email) return res.status(400).json({success:false, message:"Cannot change email"})
        if(email ){
            const emailExists = await User.findOne({email: email})
            if(emailExists && emailExists._id.toString() !== req.params.id){
                return res.status(403).json({success:false, message:"Email already exists"})
            }else{
                keysToUpdate.email = email
            }
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id,
             {$set: keysToUpdate},
            {new : true}
        )
        
        res.status(200).json({success:true, message:"User updated successfully", user:updateUser})
     } catch (error) {
        res.status(500).json({success:false, message: error.message})
 
    }

}


/**
 * @param {Delete user}
 */
export const deleteUser = async(req,res)=>{
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true, message:"User deleted successfully"})
  } catch (error) {
    res.status(500).json({success:false, message: error.message})
    
  }
}




/**
 * @param {View Users}
 */

 export const viewUsers = async(req,res)=>{
  try {
    const user = await User.findById(req.params.id)
    if(!User) return res.status(404).json({success:false, message:"User not found"})
      
      res.status(200).json({success:true, message:"Users fetched successfully", users:user.familyMembers})
  } catch (error) {
    res.status(500).json({success:false, message: error.message})
    
  }
}


/**
 * @param {Inviting User}
 */

export const inviteMembers = async(req,res)=>{
    try {
        const {email, inviteMessage} = req.body
        if(!email) return res.status(400).json({success:false, message:"Missing fields"})
        const OTP = crypto.randomBytes(6).toString("hex")
        const parentEmail = User.findOne({_id:req.params.id})
        
        const newInvitation = await Invitation.create({
            invitedBy:req.params.id,
            invitee:email,
            OTP,
        })
        const signupLink = `http://localhost:3000/invitation/signup/${req.params.id}`
       
        await transporter.sendMail({
            from:parentEmail.email,
            to:email,
            subject:"Invitation to join FamiVerse",
            html :
            `<div style="text-align: center;">
          <p style="font-size:20px; font-weight:bold;">Hello☺️,</p>
          <p style="font-size: 20px; font-weight: bold;">
            ${inviteMessage}
          </p>
          <p style="font-size: 24px; font-weight: bold;">
            Please clik on the following link to create your account:
          </p>
          <p style="font-size: 24px; font-weight: bold;">
           ${signupLink}
          </p>
          <p style="font-size: 24px; font-weight: boldxp">
           Use the following OTP for verification of your account
          </p>
          <p style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 20px;">
            ${OTP}
          </p>
        
        </div>
          `
        })

        res.status(200).json({success:true, message:"Invitation sent successfully", invitation:newInvitation})
        
        
    } catch (error) {
      res.status(500).json({success:false, message:error.message})   
    }
}


/**
 * @param {signupLink - invites}
 */

export const signupLink = async(req,res)=>{
  try {
    const { email, userOtp, fullName, familyRole, password} = req.body
    const invitation = await Invitation.findOne({OTP: userOtp, invitee: email, isAccepted : false})
    const hashedPassword= await bcryptjs.hash(password, salt)

    if(!invitation) return res.status(401).json({success: false, message:"Invitation not found. Try again Later"})
    const populateUser = await invitation.populate("invitedBy")
    const updateParent = await User.findByIdAndUpdate(populateUser.invitedBy._id,
      {$push : {familyMembers : 
        {
        name: fullName,
        email: email,
        familyRole: familyRole,
        password:hashedPassword
      },
    
    },
   
  },{new : true})
    await invitation.updateOne({isAccepted : true})

    res.json({success: true, message:"user updated successfully", updateParent})

  } catch (error) {
    res.status(500).json({success:false, message:error.message})
  }
}