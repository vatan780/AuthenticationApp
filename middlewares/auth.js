 //auth,isStudent,isAdmin

 const jwt=require('jsonwebtoken');
 require("dotenv").config()
 
 exports.auth=(req,res,next)=>{
    try {
        //extract jwt token
        //PENDING :other ways lto fetch token
        console.log("cookie=====>",req.cookies.token)
        console.log("body=====>",req.body.token)
        console.log("header=====>",req.header("Authorization"))

        const token=req.cookies.token||req.body.token|| req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token missing"
            })
        }

        //verify the token
        try {
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode)

            req.user=decode 
            
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            })
        }
        next()

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong while verying the token"
        })
        
    }

 }

 exports.isStudent= (req,res,next)=>{
    try {
        if(req.user.role !=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student and role is not student"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        }) 
    }
 }

 exports.isAdmin=(req,res,next)=>{
    try {
        if(req.user.role !=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin and  role is not admin "
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        }) 
    }
    
 }