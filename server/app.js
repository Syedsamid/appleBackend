import express from "express";
import config from "config";
import publicRouter from "./controllers/public/index.js";
import authMiddleware from "./controllers/middlewares/auth.js";

import "./utils/dbConnect.js"

//import Controllers
import userRouter from "./controllers/Users/index.js"

const app = express();
const PORT = config.get("PORT") || 5032;

app.use(express.json());

app.get("/",(req,res)=>{
    try {
        res.send(`Server is Up and Running ${PORT}`)
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

//public routes
app.use("/api/public",publicRouter);

app.use(authMiddleware);

// API Routers
app.use("/api/private/user",userRouter)

// Handle unknown Routes (404 Error Handling)
app.use((req,res)=>{
    res.status(404).json({msg: "Not found Router"});
})

app.listen(PORT,()=>{
    console.log(`PORT is running at number ${PORT}`);
})
