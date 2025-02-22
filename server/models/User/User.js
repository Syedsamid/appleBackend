
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20,
        minlength:2,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password:{
        type: String,

    },
    userVerified: {
        email: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: Boolean,
            default: false,
        },
    },
    userVerifyToken: {
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
    },   
},
{
    timestamps: true,
})

const userModel = mongoose.model("Users",userSchema,"users");

export default userModel;
