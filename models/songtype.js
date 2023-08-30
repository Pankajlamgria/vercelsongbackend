const mongoose=require("mongoose");
const {Schema}=mongoose;
const songtypeschema=new Schema({
    songtype:{type:String,required:true},
    imgurl:{type:String,required:true},
})
module.exports=mongoose.model("songtype",songtypeschema);
