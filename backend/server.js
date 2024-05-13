import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from './routes/auth.routes.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoute)

const PORT = process.env.PORT || 8000
const MONGODB_URL = process.env.MONGODB_URL

mongoose
.connect(MONGODB_URL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is listening on PORT:${PORT} and MongoDb is connected`);
    })
    })
.catch((error)=>{
    console.log(`MongoDb Connected error:${error}`);
})
 