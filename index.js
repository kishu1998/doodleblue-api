const express=require("express");
const mysql = require("./util/mysql.js");
require('dotenv').config();
const jwt =require('jsonwebtoken');
const cors = require('cors');

const app =express();

app.use(cors());
app.use(express.json());
app.get('/users',aunthenticateToken,async(req,res)=>{
    try{
    const connection = await mysql.connection();
    let users = await connection.query("SELECT * FROM users");
    res.json(users);
    }
    catch(err){
        return res.sendStatus(403);  
    }
});
app.post('/signup',async(req,res)=>{
    try{
        let {password,email,firstName,lastName,Address}=req.body;
    const connection = await mysql.connection();//INSERT INTO users (firstName,lastName,email,pwd,address) VALUES ?
    let result = await connection.query("INSERT INTO users SET ?",{firstName,lastName,email,pwd:password,Address});
    await connection.query("commit");
    const accessToken= jwt.sign(email,process.env.ACCESS_TOKEN);
    res.json({accessToken,user:{userId:result.insertId,email,firstName,lastName,Address}});
    }
    catch(err){
        console.log(error);
        return res.sendStatus(403);  
    }
});
app.post('/login',async (req,res)=>{
    const connection = await mysql.connection();
    let users = await connection.query("SELECT * FROM users WHERE email = ?", [req.body.email]);
    console.log(users,req.body);
    const userName=req.body.email;
    const password=req.body.password;
    const user={userName};
    //mysql.query();
    if(users && users[0] && users[0].pwd==password)
   {    const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN);
    res.json({accessToken,user:users[0]});
   }
   else res.json({error:"Authentication"});
});

function aunthenticateToken(req,res,next){
    try{  
    const token=req.headers['authorization'].split(' ')[1];
        if(token==null) return res.sendStatus(401);
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
        if(err) return res.sendStatus(403);

        next();
})}
catch(err)
{
    return res.sendStatus(403);
    
}
}
app.listen(3012)