const express=require("express");
const mysql = require("./util/mysql.js");
require('dotenv').config();
const jwt =require('jsonwebtoken');
const cors = require('cors');

const app =express();

app.use(cors());
app.use(express.json());

app.post('/login',async (req,res)=>{
    const connection = await mysql.connection();
    let users = await connection.query("SELECT * FROM users WHERE email = ?", [req.body.email]);
    console.log(users,req.body);
    const userName=req.body.email;
    const password=req.body.password;
    const user={userName};
    //mysql.query();
   const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN);
   res.json({accessToken});
});

function aunthenticateToken(req,res,next){
        const token=req.headers['authorization'];
        if(token==null) return res.sendStatus(401);
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
        if(err) return res.sendStatus(403);
            req.user=user;
        next();
})
}
app.listen(3012)