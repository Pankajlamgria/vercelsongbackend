{require("dotenv").config();}
const jwt=require("jsonwebtoken");
// const SECRET="pankajlamgria";


const fetchuser=async(req,res,next)=>{
    const authtoken=req.header('authtoken');
    // console.log(authtoken);

    if(!authtoken){
        console.log("no Authentication");
        return res.json({success:false,error:"Authentication not matched"});
    }   
    let tokendetail=jwt.verify(authtoken,"pankajlamgria");
    req.userid=tokendetail.user.id;
    next();

    // if(authtoken){
    //     console.log("entered");
    //     const tokendetail=jwt.verify(authtoken,`${SECRET}`);
    //     req.userid=tokendetail.user.id;
    //     // console.log(req.userid);
    //     next();
    // }
    // else{
    //     console.log("no access");
    //     next();
    // }
}
module.exports=fetchuser;