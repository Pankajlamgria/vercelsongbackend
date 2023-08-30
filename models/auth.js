const mongoose=require('mongoose');
const {Schema}=mongoose;
const authschema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
})

module.exports=mongoose.model('user',authschema);