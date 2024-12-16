import mongo from "mongoose"


const inviteSchema = mongo.Schema({
    invitedBy:{
        type:mongo.Schema.Types.ObjectId,
        ref:"User"
    },
    invitee:{
        type:String,
        default:null
    },
    isAccepted:{
        type:Boolean,
        default:false,

    },
    OTP:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now,
        expires: "7d"
    },

})

export default mongo.model('Invites', inviteSchema)