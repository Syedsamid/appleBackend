import express from "express";
import config from "config";
import bcrypt from "bcrypt";
import userModel from "../../models/User/User.js";
import sendSMS from "../../utils/sendSMS.js";
import sendMail from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = config.get("JWT_SECRET");
const URL = config.get("SERVER_URL");

router.post("/register",async (req,res)=>{
    try {
        const { name, email, password, phone } = req.body;
        console.log(name, email, password, phone);

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:"Email already exists"});

        }
        const hashedPassword = await bcrypt.hash(password,10);

        const emailToken = Math.random().toString(36).substring(2);
        const phoneToken = Math.random().toString(36).substring(2);

        // Create user Object
        const newUser = {
            name,
            email,
            phone,
            password: hashedPassword,
            userVerifyToken: {
                email: emailToken,
                phone: phoneToken,
            },
        }
        await userModel.create(newUser);

        await sendMail({
            subject: "Email Verification",
            to: email,
            html:` <p>Hello samid</p>
            <br>
            <p>IF the link doesn't work copy and past the url<p/>
            `
        });
        console.log(`${URL}/api/public/emailverify/${emailToken}`);
        console.log(`Please verify your phone number: ${URL}/api/public/phoneverify/${phoneToken}`);

        res.status(201).json({
            msg:"User registered successfully. Please verify your email and phone."
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
})

// Login

router.post("/login",async (req,res)=>{
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({msg: "invalid Credentials"});
        }
        // check if email is verified
        if(!user.userVerified.email){
            return res.status(400).json({msg: "Please verify your email before loggin in"})
        }

        // check if phone is verified
        if(!user.userVerified.phone){
            return res.status(400).json({msg: "Phone verify your phone before loggin in"})
        }

        // Check password validity
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({msg: "Invalid credentials"});
        }

        // Generate JWT token
        const token = jwt.sign({id: user._id}, JWT_KEY, {expiresIn: "1hr"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

// Email verification Route
router.get("/emailverify/token",async(req,res)=>{
    try {
        const {token} = req.params;
        const user = await userModel.findOne({"userVerifyToken.email": token});
        if (!user){
            return res.status(400).json({msg:"Invalid email verification token"})
        }
        // Mark email as verified
        user.userVerified.email = true;
        user.userVerifiedToken.email = null;
        await user.save();
        res.status(200).json({msg: "Email Verified successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
});

// Phone Verification 
router.get("/phoneverify/:token", async (req,res)=>{
    try {
    const {token} = req.params;
    const user = await userModel.findOne({"userVerifyToken.phone": token});

    if(!user){
        return res.status(400).json({msg: "Invalid phone veerigication token"})
    }

    // Mark phone as verified
    user.userVerified.phone = true;
    user.userVerifyToken.phone = null;
    await user.save();

    res.status(200).json({msg: "Phone verified successfully"})
} catch (error) {
    console.log(error);
    res.status(500).json({msg: error.message});
}
});

export default router;
