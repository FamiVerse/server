import express from 'express'
import cors from "cors"
import dotenv from "dotenv"
import main from "./routes/main.route.js"
import user from "./routes/userManagement.route.js"
import Task from "./routes/task.route.js"
import { databaseConnection } from './utils/db.mongo.js'
const app = express()


dotenv.config()

//Database function
databaseConnection()


/**
 * @params {Middleware}
 */

const allowedOrgins = []

app.use(cors({
    origin: allowedOrgins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

app.use("/", main)
app.use("/user", user)
app.use("/task", Task)


app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})