const express=require('express');
{require("dotenv").config();}
const app=express();
const connect=require('./dbs.js');
const cors=require("cors");
connect();
app.use(cors());
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));
const port =process.env.PORT || 4000;

app.use('/api/auth',require("./routes/auth.js"));
app.use('/api/song',require("./routes/song.js"));
app.use('/api/liked',require("./routes/liked.js"));

app.listen(port,()=>{
    console.log(`server running on port http://localhost:${port}`);
})