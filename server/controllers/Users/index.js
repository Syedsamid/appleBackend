import express from "express";
import userModel from "../../models/User/User.js";

const router = express.Router();

router.get("/getallusers",async(req,res)=>{
    try {
        // fetch all users from the database
        const users = await userModel.find();

        // check if users exist
        if (!users || users.length === 0){
            return res.status(404).json({msg: "No users found."});
        }
        // Return the list of users
        res.status(200).json({
            msg: "users retrieved successfully",
            users,
        });

    } catch (error) {
        console.error("Error Fetching users",error);
        res.status(500).json({msg: "An error occurred while fetching users"})
    }
});


router.get("/getbyid/:id",async (req,res)=>{
    try {
        let userInputID = req.params.id;
        console.log(userInputID);  // I got the userId 
        // now take that id and search in whole mongodb and find it

        // let findMyUser = await userModel.findById(userInputID);
        let findMyUser = await userModel.findOne({_id:userInputID})
        if(!findMyUser){
        return res.status(400).json({msg:"Invalid ID"}) 
        }
        res.status(200).json({msg:findMyUser})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
})


router.put("/update/:id", async (req,res)=>{
    try {
        let userid = req.params.id;
        let userData = req.body;

        await userModel.findOneAndUpdate(
            {
                _id: userid,
            },
            {
                $set: userData,
            },
            {
                new: true,
            }
        );
        res.status(200).json({msg:"User Updated successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
});

router.delete("/deleteallusers", async(req,res)=>{
    try {
        await userModel.deleteMany({});
        res.status(200).json({msg: "All Users are deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
});

router.post("/login",(req,res)=>{
    try {
        res.status(200).json({msg:"This is user login form"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
});

export default router;
