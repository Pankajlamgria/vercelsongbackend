const mongoose=require('mongoose');
const db2=`mongodb+srv://pankajlamgria:Pankaj123@cluster0.dybwrfj.mongodb.net/spotifyapp?retryWrites=true&w=majority`;
// const connect=async()=>{
//     await mongoose.connect('mongodb://0.0.0.0:27017/music');
//     console.log("connected");
// }
// module.exports=connect;

function connectdatabase() {
    mongoose.connect(db2,{
        // useCreateIndex:true,
        // useFindAndModify:false,
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>console.log("connection started")).catch((error)=>console.log(error.message));
}
module.exports=connectdatabase;