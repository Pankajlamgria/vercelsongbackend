const mongoose =require("mongoose");
const {Schema}=mongoose;
const likedschema=new Schema({
    songid:{type:Schema.Types.ObjectId,ref:"song"},
    userid:{type:Schema.Types.ObjectId,ref:"user"},
    songname:{type:String,required:true},
    artistname:{type:String,required:true},
    imgurl:{type:String,required:true},
    songurl:{type:String,required:true},
    language:{type:String,required:true},
    songtype:{type:String,required:true},
    time:{type:Date,default:Date.now},
    like:{type:Boolean,required:true},
    length:{type:Number,default:0},
    ct:{type:Number,default:0},
})

module.exports=mongoose.model("likedsong",likedschema);