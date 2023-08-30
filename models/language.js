const mongoose=require("mongoose");
const {Schema}=mongoose;
const languageschema=new Schema({
    language:{type:String,required:true},
    imgurl:{type:String,required:true},
})
module.exports=mongoose.model("songlanguage",languageschema);
