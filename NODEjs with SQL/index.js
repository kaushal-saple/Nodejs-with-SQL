const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

let port = 8080;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'Kaushal01&'
    });
    

app.listen(port,()=>{
    console.log(`listening to server port ${port}`);
})


//get user count
app.get("/",(req,res)=>{
    // res.send("home page working");
    let q = `SELECT COUNT(*) FROM user`;
    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            // console.log(results);
            // res.send("success");
            let count = results[0]["COUNT(*)"];
            res.render("home.ejs",{count});
        })
    }catch(err){
        console.log(err);
    }
})

//get all users 
app.get("/users",(req,res)=>{
    // res.send("user route working fine");
    let q = 'SELECT * FROM user';
    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            // console.log(results);
            let users = results;
            res.render("usersData.ejs",{users});
        })
    }catch(err){
        console.log(err);
    }
})

//edit Database
app.get("/users/:id/edit",(req,res)=>{
    // console.log("edit route working");
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            let user = results[0];
            console.log(user);
            res.render("edit.ejs",{user});
        })
    }catch(err){
        console.log(err);
    }
})

//post request from edit.ejs
app.patch("/users/:id",(req,res)=>{
    let {id} = req.params;
    let {password:formPass,username:formName} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            let user = results[0];
            if(formPass!=user.password){
                res.send("Wrong password");
            }else{
                let q2 = `UPDATE user SET username = '${formName}' WHERE id = '${id}'`;
                connection.query(q2,(err,results)=>{
                    if(err) throw err;
                    res.redirect("/users");
                })
            }
            
        })
    }catch(err){
        console.log(err);
    }
})

//creating new user
app.get("/users/new",(req,res)=>{
    res.render("newUser.ejs");
})

//creating new user
app.post("/users/new",(req,res)=>{
    let{username,email,password} = req.body;
    let user = [[uuidv4(),username,email,password]];
    let q = `INSERT INTO user (id,username,email,password) VALUES ?`;
    try{
        connection.query(q,[user],(err,results)=>{
            if(err) throw err ;
            res.redirect("/users");
        })
        
    }catch(err){
        console.log(err);
    }
    
});

app.get("/users/:id/remove",(req,res)=>{
    let {id} = req.params;
    res.render("deleteVerify.ejs",{id});
})
//DELETE
app.delete("/users/:id",(req,res)=>{
    let {id} = req.params;
    let {email:formEmail, password:formpass} = req.body;
    console.log(req.body);
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            let user = results[0];
            console.log(formEmail);
            console.log(formpass);
            if(formEmail===user.email && formpass===user.password){
                q2 = `DELETE FROM user WHERE id = '${id}'`;
                connection.query(q2,(err,results)=>{
                    res.redirect("/users");
                })
                
            }else{
                res.send("wrong credentials");
            }
        })

    }catch(err){
        console.log(err);
    }
    
})














