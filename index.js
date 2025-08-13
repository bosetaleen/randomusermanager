const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'test',
    password:'12012005'
}
);

let getRandomUser=()=>{
     return [
     faker.string.uuid(),
   faker.internet.username(), 
   faker.internet.email(),
   faker.internet.password()

     ];
};


//home route
app.get("/",(req,res)=>{
    let q="select count(*) from user";
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count=result[0]["count(*)"]
            res.render("home.ejs",{count})
        });
    }catch(err){
        console.log(err);
        res.send("error");
    }
  
});

//show users route
app.get("/user",(req,res)=>{
    let q="select * from user";
      try{
        connection.query(q,(err,users)=>{
            if(err) throw err;
            console.log(users);
           res.render("show.ejs",{users});
        });
    }catch(err){
        console.log(err);
        res.send("error");
    }
});

//edit route
app.get("/user/:id/edit",(req,res)=>{
    let{id}=req.params;
    let q=`select * from user where id="${id}"`;
       try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result);
           res.render("edit.ejs",{user:result[0]});
        });
    }catch(err){
        console.log(err);
        res.send("error");
    }
   
});

//update route
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let { password:formpass , username:newUsername}=req.body;
     let q=`select * from user where id="${id}"`;
       try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            if (formpass != user.password){
                res.send("wrong password");
            }else{
                let q2=`update user set username='${newUsername}' where id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                   res.redirect("/user");
                })
            }
        
        });
    }catch(err){
        console.log(err);
        res.send("error");
    }
})


app.listen("8080",()=>{
    console.log("server is listening to port 8080");
})



