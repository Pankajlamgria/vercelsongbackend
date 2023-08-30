const mongoose=require("mongoose");
const {Schema}=mongoose;
const songschema=new Schema({
    songname:{type:String,required:true},
    artistname:{type:String,required:true},
    imgurl:{type:String,required:true},
    songurl:{type:String,required:true},
    language:{type:String,required:true},
    songtype:{type:String,required:true},
    time:{type:Date,default:Date.now},
    length:{type:Number,default:0},
    ct:{type:Number,default:0},
})
module.exports=mongoose.model("song",songschema);
