import mongo from "mongoose"



const taskSchema = mongo.Schema({
    name: {
        type:String,
        required:true
    },
    description:String,
    userId:{
        type:mongo.Schema.Types.ObjectId,
        ref:"User"
    },
    taskDate:{
        type:Date,
        required:true,
    },
    isCompleted:{
        type:Boolean,
        default:false,
    },
    description:{
        type:String,
        default:null,
    }


})


export default mongo.model("Task", taskSchema)