const mongoose=require("mongoose");
const {Schema}=mongoose;
const artistschema=new Schema({
    artistname:{type:String,required:true},
    imgurl:{type:String,required:true},
})
module.exports=mongoose.model("artistname",artistschema);
