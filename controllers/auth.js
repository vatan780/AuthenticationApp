const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const User=require('../models/User');
require("dotenv").config()

//signup route handler

exports.signup=async (req,res)=>{
    try{
        //get data
        const {name,email,password,role}=req.body;
        console.log(req.body)
        //check if user already exist

        const existingUser=await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already Exists",
            });
        }
        
        //secure password
        let hashedPassword
        try {
            hashedPassword=await bcrypt.hash(password,10);
            
        } catch (error) {
            return res.status(500).json({
                success:true,
                message:"Error in hashing Password"
            });
        }
       
        //create entry for user
        const user=await User.create({
            name,email,password:hashedPassword,role
        })
    
        return res.status(200).json({
            success:true,
            message:"User created sucessfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, please try again later"
        })

    }
}


//login

exports.login= async (req,res)=>{
    try {
        //data fetch

       const  {email,password}=req.body
       if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the detail crefully"
        });
       }

       let user=await User.findOne({email})

       if(!user){
        return res.status(400).json({
            success:false,
            message:"user is not register"
        })
       }

       payload={
        email:user.email,
        id:user._id,
        role:user.role
       }
       //verify password and generate a JWt token
       if (await bcrypt.compare(password,user.password)){
        //password match
        let token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});

        user=user.toObject()

        user.token=token;
        user.password=undefined;
        console.log(user)
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("vatancookie",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Usere Logged in successfully"
        })


       }else{
        //if  password not match
        return res.status(403).json({
            success:false,
            message:"Password Incorrect"
        })
       }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure"
        });   
    }
}