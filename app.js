const express=require("express");
const app=express();
const path=require("path");
const port=4000;

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const records= require("./models/records");

app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

const mongoose = require('mongoose');

main()
.then(()=>{console.log("mongo running")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/patient_tracker');
}

app.get("/",(req,res)=>{
  res.render("login.ejs");
})
app.get("/login",(req,res)=>{
  res.render("login.ejs");
})
app.get("/details",(req,res)=>{
  res.render("details.ejs");
})
app.get("/dashboard",(req,res)=>{
  res.render("dashboard.ejs");
})
app.get("/addrecord",(req,res)=>{
  res.render("addRecord.ejs");
})

app.post("/dashboard",(req,res)=>{
  console.log(req.body);
})




app.listen(port,()=>{
    console.log(`server is running `);
});