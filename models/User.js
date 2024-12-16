import mongo from "mongoose"


const userSchema = mongo.Schema({

    fullName:String,
    email:String,
    familyRole:String,
    password:String,
    resetToken:{
        type:String,
        default:null
    },
   signupToken:{
        type:String,
        default:null
    },
    resetTokenExpiration:{
        type:Date,
        default: () => Date.now() + 60 * 60 * 1000,
    },

    familyMembers:{
        type:[{
            name:String,
            email:String,
            familyRole:String,
            password:String
               
        }],
        default:[],

    },
    verify:{
        type:Boolean,
        default:false,
    }
})

 export default mongo.model("User", userSchema)
 