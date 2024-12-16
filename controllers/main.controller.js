// controller.js
import express from "express";
import User from "../models/User.js";
import { transporter, mailOptions } from "../utils/gmail.config.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";

const router = express.Router();
const saltRounds = 10;

dotenv.config();

//Mailer


export const Signup = async (req, res) => {
  try {
      const { fullName, email, familyRole, password, confirmPassword } = req.body;
      const OTP = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP

      if (!fullName || !email || !familyRole || !password || !confirmPassword) {
          return res.status(400).json({ success: false, message: "Missing fields" });
      }
      if (password !== confirmPassword) {
          return res.status(403).json({ success: false, message: "Passwords don't match" });
      }

      const hashedPassword = await bcryptjs.hash(password, saltRounds);
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(403).json({ success: false, message: "User  already exists" });

      const newUser  = await User.create({
          fullName,
          email,
          familyRole,
          password: hashedPassword,
          verify: false, // Add a field to track if the user is verified
          signupToken: OTP // Store the OTP for verification
      });

      // Send OTP email
      await transporter.sendMail(mailOptions(email, fullName, OTP), (error, info) => {
          if (error) throw new Error("Error sending mail");
          res.status(200).json({ success: true, message: "Successfully sent mail" });
      });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
      const { email, OTP } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ success: false, message: "User  not found" });
      if (user.signupToken !== OTP) return res.status(403).json({ success: false, message: "Invalid OTP" });

      user.verify = true; // Mark user as verified
      user.signupToken = null; // Clear the OTP
      await user.save();

      res.status(200).json({ success: true, message: "User  verified successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * @login
 */

export const Login = async(req,res)=>{
    try {
        const {email, password} = req.body
        if(!email ||!password) return res.status(400).json({success:false, message:"Missing fields"})
        const user = await User.findOne({email}).select("+password")
        if(!user) return res.status(404).json({success:false, message:"User not found"})
        const isMatch = await bcryptjs.compare(password, user.password)
        if(!isMatch) return res.status(401).json({success:false, message:"Incorrect password"})
        // const token = user.generateAuthToken()
        res.json({success:true, message:"Logged in successfully"})
        
    } catch (error) {
        res.status(500).json({success:false, message: error.message})       
    
    }
}

export const googleLogin = async(req,res)=>{
  
    try {
      const {email} = req.body
      const OTP = crypto.randomBytes(3).toString('hex')

      
        if(!email) return res.status(400).json({success:false, message:"Missing fields"})
        const userExists = await User.findOne({email: email})
        if(!userExists) return res.status(403).json({success:false, message:"No email associated with this account"})
          mailOptions(email, userExists.fullName, OTP)
         
            transporter.sendMail(mailOptions, (error, info)=>{
              console.log("error", error)
              if(error) throw new Error("Error sending mail")
              res.status(200).json({success:true, message:"Successfully sent mail"})
            })
            console.log(OTP)
        userExists.resetToken = OTP
        userExists.resetTokenExpiration = Date.now() + 30 * 60 * 1000
        await userExists.save()
      
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const authGoogleOTP = async(req,res)=>{
  try {
      const {email, OTP} = req.body
     const validateUser = await User.findOne({email: email})
     if(!validateUser) return res.status(404).json({success:false, message:"User not found"})
     if(validateUser.resetTokenExpiration < Date.now()) return res.status(403).json({success:false, message:"Token expired"})
     if(validateUser.resetToken!== OTP) return res.status(403).json({success:false, message:"Invalid OTP"})
    if(validateUser.verify === false) {
      if(validateUser.signupToken === OTP){
        validateUser.verify = true
      }
      else{
        return res.status(403).json({success:false, message:"Invalid OTP"})
      }
    }
      res.status(200).json({success:true, message:"Login successful"})
  } catch (error) {
   res.status(500).json({success:false, message:"Login Failed"}) 

  }
}