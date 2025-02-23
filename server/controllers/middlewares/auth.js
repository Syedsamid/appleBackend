import jwt from "jsonwebtoken";
import config from "config";

const JWT_SECRET = config.get("JWT_SECRET");

const authMiddleware = (req,res, next) =>{

    // Get the token from the Authorization header
    const authHeader  = req.Headers["authorization"];
    console.log(authHeader);
    if(!authHeader){
        return res.status(401).json({msg: "No token provided"});
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Invalid token:", error);
        return res.status(401).json({msg: "Invalid token"})
    }
};

export default authMiddleware