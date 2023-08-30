{require("dotenv").config();}
const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const bcrypt=require('bcryptjs');
const auth=require("../models/auth.js");
const fetchuser = require("../connection/fetchuser.js");
// const SECRET="pankajlamgria";
// console.log(SECRET);

router.post("/signin",async(req,res)=>{
    const bodydata=req.body;
    let success=false;
    if(bodydata.name===""||bodydata.email===""||bodydata.password===""){
        res.json({success,error:"Enter the valid details."});
    }
    else if(!bodydata.email.includes('@gmail.com')){
        res.json({success,error:"Enter the correct email address."});
    }
    else{
        const newuser=await auth.findOne({email:bodydata.email});
        if(newuser){
            res.json({success,error:"email already exist"});  
        }
        else{
            try{
                const salt=await bcrypt.genSalt(10);
                const strongpassword=await bcrypt.hash(bodydata.password,salt);
                const createduser=await auth.create({
                    name:bodydata.name,
                    email:bodydata.email,
                    password:strongpassword
                })
                const token={
                    user:{id:createduser.id}
                }
                const authtoken=jwt.sign(token,"pankajlamgria");
                // console.log(authtoken);
                success=true;
                res.json({success,authtoken});
            }
            catch(error){
                res.json({success,error});
            }

        }
    }
})


router.post("/login",async(req,res)=>{
    const bodydata=req.body;
    let success=false;
    if(!bodydata.email.includes('@gmail.com')){
        res.json({success,error:"Enter the correct email address."});
    }
    else{
        const newuser=await auth.findOne({email:bodydata.email});
        if(!newuser){
            res.json({success,error:"email doesnot exist"});  
        }
        else{
            try{
                const result=await bcrypt.compare(bodydata.password,newuser.password);
                if(result){
                    const token={
                        user:{id:newuser.id}
                    };
                    const authtoken=jwt.sign(token,"pankajlamgria");
                    success=true;
                    res.json({success,authtoken});
                }
                else{
                    res.json({success,error:"Wrong password"});
                }
            }
            catch(error){
                res.json({success,error});
            }

        }
    }
})


router.get("/userdetail",fetchuser ,async(req,res)=>{
    const id=req.userid;
    const user=await auth.findById(id).select("-password");
    if(user){
        res.json({success:true,user});
    }
    else{
        res.json({success:false,error:"user not found"});
    }
    
})
module.exports=router;