const express=require('express');
const route=express.Router()

const {login,signup}=require("../controllers/auth")
const {auth,isStudent,isAdmin}=require("../middlewares/auth")

route.post("/login",login);
route.post("/signup",signup)


//protected routes
route.get('/test',auth,(req,res)=>{
    res.json({
        success:true,
        message:"welcome to the protected route of Tests"
    })
})

route.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route of student"
    });
});

route.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for Admin",
    })
})


module.exports=route