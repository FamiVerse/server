import mongo from "mongoose"
console.log("Hello")
export const databaseConnection = async ()=>{
    try {
        
        await mongo.connect(process.env.MONGO_URI)

        console.log("Connected to Mongo Successfully")




    } catch (error) {
        console.log("Error connecting", error.message)
    }
}