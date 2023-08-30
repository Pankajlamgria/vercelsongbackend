const express = require("express");
{require("dotenv").config();}
const router = express.Router();
const auth = require("../models/auth.js");
const artist = require("../models/artist.js");
const language = require("../models/language.js");
const song = require("../models/song.js");
const songtype = require("../models/songtype.js");
const recent = require("../models/recently.js");
const fetchuser = require("../connection/fetchuser.js");
const jwt=require("jsonwebtoken");

function titleCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
function fetchuserid(string){
  const authtoken=string;
  const token=jwt.verify(authtoken,`${process.env.SECRET}`);
  return token.user.id;
}

// Add Sec
router.post("/addsong", fetchuser, async (req, res) => {
  let success = false;
  const userdetail = await auth.findById(req.userid);
  const bodydata = req.body;
  bodydata.songname = titleCase(bodydata.songname);
  bodydata.artistname = titleCase(bodydata.artistname);
  bodydata.language = titleCase(bodydata.language);
  bodydata.songtype = titleCase(bodydata.songtype);
  if (userdetail.email === "pankajlamgria@gmail.com") {
    if (
      bodydata.songname === "" ||
      bodydata.artistname === "" ||
      bodydata.imgurl === "" ||
      bodydata.songurl === "" ||
      bodydata.language === "" ||
      bodydata.type === ""
    ) {
      // res.send({404:})
      res.json({ success, error: "Please give the appropriate details" });
    }
    if (await song.findOne({ songname: bodydata.songname })) {
      res.json({ success, error: "Song by this name exist already." });
    } else {
      const newsong = await song.create({
        songname: bodydata.songname,
        artistname: bodydata.artistname,
        imgurl: bodydata.imgurl,
        songurl: bodydata.songurl,
        language: bodydata.language,
        songtype: bodydata.songtype,
      });
      if (!(await artist.findOne({ artistname: bodydata.artistname }))) {
        await artist.create({
          imgurl: bodydata.imgurl,
          artistname: bodydata.artistname,
        });
      }

      if (!(await language.findOne({ language: bodydata.language }))) {
        await language.create({
          imgurl: bodydata.imgurl,
          language: bodydata.language,
        });
      }

      if (!(await songtype.findOne({ songtype: bodydata.songtype }))) {
        await songtype.create({
          imgurl: bodydata.imgurl,
          songtype: bodydata.songtype,
        });
      }
      success = true;
      res.json({ success, msg: "Song has been successfully added." });
    }
  } else {
    res.json({ success, error: "Access Denied." });
  }
});

// Delete Sec
router.delete('/deletesong/:songid',fetchuser,async(req,res)=>{
  const userdetail=await auth.findById(req.userid);
  const songid=req.params.songid;
  var success=false;
  if(userdetail.email==="pankajlamgria@gmail.com"){
    const deletedsong=await song.findByIdAndDelete(songid);
    const typefind=await song.findOne({songtype:deletedsong.songtype});
    const languagefind=await song.findOne({language:deletedsong.language});
    const artistfind=await song.findOne({artistname:deletedsong.artistname});
    if(!typefind){
      await songtype.deleteOne({songtype:deletedsong.songtype});
    }
    if(!languagefind){
      await language.deleteOne({language:deletedsong.language});
    }
    if(!artistfind){
      await artist.deleteOne({artistname:deletedsong.artistname});
    }
    success=true;
    res.json({success,deletedsong});
  }
  else{
    res.json({success,error:"Access denied"});
  }
})

// Edit Sec
router.post("/edit/:songid",fetchuser,async(req,res)=>{
  const userdetail=await auth.findById(req.userid);
  const oldsongdetail=await song.findById(req.params.songid);
  const bodydata=req.body;

  bodydata.language=titleCase(bodydata.language);
  bodydata.artistname=titleCase(bodydata.artistname);
  bodydata.songtype=titleCase(bodydata.songtype);
  let success=false;
  if(userdetail.email==="pankajlamgria@gmail.com"){
    const newdata={
      artistname: bodydata.artistname,
      language: bodydata.language,
      songtype: bodydata.songtype
    }
    const updatedata=await song.findByIdAndUpdate(req.params.songid,{$set:newdata});
    if(oldsongdetail.artistname!==newdata.artistname){
      const oldartistsong=await song.findOne({artistname:oldsongdetail.artistname});
      const newartistsong=await artist.findOne({artistname:newdata.artistname});
      if(!oldartistsong){
        await artist.deleteOne({artistname:oldsongdetail.artistname});
      }
      if(!newartistsong){
        await artist.create({
          imgurl: oldsongdetail.imgurl,
          artistname: newdata.artistname,
        });
      }
    }
    if(oldsongdetail.songtype!==newdata.songtype){
      const oldsongtype=await song.findOne({songtype:oldsongdetail.songtype});
      const newsongtype=await songtype.findOne({songtype:newdata.songtype});
      if(!oldsongtype){
        await songtype.deleteOne({songtype:oldsongdetail.songtype});
      }
      if(!newsongtype){
        await songtype.create({
          imgurl: oldsongdetail.imgurl,
          songtype: newdata.songtype,
        });
      }
    }
    if(oldsongdetail.language!==newdata.language){
      const oldsongtype=await song.findOne({language:oldsongdetail.language});
      const newsongtype=await language.findOne({language:newdata.language});
      if(!oldsongtype){language
        await language.deleteOne({language:oldsongdetail.language});
      }
      if(!newsongtype){
        await language.create({
          imgurl: oldsongdetail.imgurl,
          language: newdata.language,
        });
      }
    }
    success=true;
    res.json({success,msg:"Successfully Edited."});
  }
  else{
    res.json({success,error:"Access denied"});
  }
})


// Show all song
router.get("/homepage",async(req,res)=>{
  const allartist=await artist.find({});
  const alllanguage=await language.find({});
  const allsongtype=await songtype.find({});
  // res.json({success:true,recentsongs,allartist,alllanguage,allsongtype})
  res.json({success:true,allartist,alllanguage,allsongtype})
})

router.get("/recentsongs",fetchuser,async(req,res)=>{
  const recentsongs=await recent.find({userid:req.userid});
  res.json({success:true,recentsongs});
})
// show song by Id
router.get("/findsong/:id",async(req,res)=>{
  const songdata=await song.findById(req.params.id);
  res.json({success:true,songdata});
})

router.get("/recentsongs",fetchuser,async(req,res)=>{
  const recentsongs=await recent.find({userid:req.userid});
  res.json({success:true,recentsongs});
})

// Show songs of artist block
router.get("/homepage/artist/:filtername",async(req,res)=>{
  let success=false;
  try{;
    const filteredsongs=await song.find({artistname:`${req.params.filtername}`});
    success=true;
    res.json({success,filteredsongs});
  }
  catch(error){
    res.json({success,error});
  }
})
// Show songs fo songtype
router.get("/homepage/songtype/:filtername",async(req,res)=>{
  let success=false;
  try{;
    const filteredsongs=await song.find({songtype:`${req.params.filtername}`});
    success=true;
    res.json({success,filteredsongs});
  }
  catch(error){
    res.json({success,error});
  }
})
// Show songs fo language
router.get("/homepage/language/:filtername",async(req,res)=>{
  let success=false;
  try{;
    const filteredsongs=await song.find({language:`${req.params.filtername}`});
    success=true;
    res.json({success,filteredsongs});
  }
  catch(error){
    res.json({success,error});
  }
})


// Add recently played song
router.post("/addrecentlyplayed/:songid",fetchuser,async(req,res)=>{
  const songdata=await song.findById(req.params.songid);
  let success=false;
  try{
    const usersrecentsong=await recent.find({userid:req.userid});
    
    if(usersrecentsong.length>=8){
      const firstrecentsongid=usersrecentsong[0].id;
      await recent.findByIdAndDelete(firstrecentsongid);
    }
    
    const size=usersrecentsong.length;
    if(size!=0 && songdata.songname===usersrecentsong[size-1].songname){
     
      res.json({success:true,msg:"same song already exist at the last position."});

    }
    else{
     
      const newrecentsong=await recent.create({
        songid:req.params.songid,
        userid:req.userid,
        songname:songdata.songname,
        artistname:songdata.artistname,
        imgurl:songdata.imgurl,
        songurl:songdata.songurl,
        language:songdata.language,
        songtype:songdata.songtype
      })
      success=true;
      res.json({success,newrecentsong});
    }
    
  }
  catch(error){
    res.json({success,error});

  }
})

// Search song by name
router.get("/search/:songname",async(req,res)=>{
  let success = false;
  const filter=req.params.songname;
  try {
    const searchedsong=await song.findOne({songname:filter});
    if(searchedsong){
        success=true;
        res.json({success,searchedsong});
    }
    else{
        const allsong=await song.find({});
        let arraydata=[];
        for (let index = 0; index <  allsong.length; index++) {
            const name=allsong[index].songname;
            if(RegExp(filter, 'i').test(name)){
                arraydata.push(allsong[index]);
            }
        }
        if(arraydata.length===0){
            res.json({success,error:"No data found by this name"});
        }
        else{
            success=true;
            res.json({success,arraydata}); 
        }
    }
  } catch (error) {
    res.json({ success, error });
  }
})
module.exports = router;
