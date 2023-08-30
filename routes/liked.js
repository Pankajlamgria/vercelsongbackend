{
  require("dotenv").config();
}
const express = require("express");
const router = express.Router();
const fetchuser = require("../connection/fetchuser");
const song = require("../models/song.js");
const liked = require("../models/liked.js");

// Addliked song
router.post("/addlikedsong/:id", fetchuser, async (req, res) => {
  let success = false;
  if (!req.userid) {
    res.json({ success, msg: "Login first" });
  } else {
    try {
      const songdetail = await song.findById(req.params.id);
      const likedsong=await liked.findOne({userid:req.userid,songid:req.params.id});
      if(likedsong){
        res.json({success:true,msg:"already added in favourate section."});
      }
      else{
          const newlikedsong = await liked.create({
            songid: req.params.id,
            userid: req.userid,
            songname: songdetail.songname,
            artistname: songdetail.artistname,
            imgurl: songdetail.imgurl,
            songurl: songdetail.songurl,
            language: songdetail.language,
            songtype: songdetail.songtype,
            like: true,
          });
          success=true;
          res.json({success,newlikedsong});   
      }
    } catch (error) {
      res.json({ success, error });
    }
  }
});


// Deleting song
router.delete("/deletesong/:songid", fetchuser, async (req, res) => {
  let success = false;
  if (!req.userid) {
    res.json({ success, msg: "Login first" });
  } else {
    try {
        const deletedsong=await liked.findOneAndDelete({userid:req.userid,songid:req.params.songid});
      success=true;
      res.json({success,deletedsong});
    } catch (error) {
      res.json({ success, error });
    }
  }
});


// Show liked song
router.get("/showall", fetchuser, async (req, res) => {
  let success = false;
  if (!req.userid) {
    res.json({ success, msg: "Login first" });
  } else {
    try {
        const allsong=await liked.find({userid:req.userid});
      success=true;
      res.json({success,allsong});
    } catch (error) {
      res.json({ success, error });
    }
  }
});
module.exports = router;
