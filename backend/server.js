import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"

import connectToMongoDB from "./db/connectToMongoDB.js";


const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); //to parse the incoming requests with JSON payloads(from req.body)
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);


// app.get("/",(req,res)=>{
//     //root route http://localhost:5000/

//     res.send('hello rehab');

// });


app.listen(PORT,()=> 
{
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)
});