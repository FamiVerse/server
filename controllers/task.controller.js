
import cron from "node-cron"
import User from "../models/User.js"
import Task from "../models/Task.js"

/**
 * 
 * @param {Task creation} req 
 * @param {*} res 
 * @returns 
 */


export const newTask = async(req,res)=>{
    try {
        const {taskName, description, taskDate, toBeDoneBy } = req.body
        if(!taskName ||!taskDate ||!toBeDoneBy) return res.status(400).json({success:false, message:"Missing fields"})
        const findUser = User.findOne({_id:req.params.id})
        if(!findUser) return res.status(404).json({success:false, message:"User not found"})  
        const familyMemberId = findUser
        res.json({familyMemberId:findUser})
        const newTask = await Task.create({
            name:taskName, 
            description,
            taskDate,
            userId: findUser._id,
        })
        // res.status(201).json({success:true, message:"Task created successfully"})
        // const emailOptions = {
        //     from:process.env.mail_user,
        //     to:email,
        //     subject:"Family Task ",
        //     html :
        //     `<div style="text-align: center;">
        //     <p style="font-size:20px; font-weight:bold;">Hello ${userExists.fullName} ☺️,</p>
        //     <p style="font-size: 20px; font-weight: bold;">
        //         You are receiving this email because you've been given a task todo. 
        //   </p>
           
        //   <p style="font-size: 24px; font-weight: bold;">
        //    TASK : ${taskName},
        //    Description : ${description},
        //   </p>
        //   <p style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 20px;">
        //     Date to do the task is ${taskDate}
        //   </p>
        
        // </div>
        //   `
        //     }

    } catch (error) {
        res.status(500).json({success:false, message:error.message})

    }
}


/**
 * @param {GET - Tasks}
 */

export const getTasks = async(req,res)=>{
    try {
        const tasks = await Task.find({isCompleted: true})
        cron.schedule("* * * * *", ()=>{
            const today = new Date()
            // you'll tell me if you need to be notified
        })
        // res.status(200).json({success:true, tasks})

    } catch (error) {
        
    }
}
