const express=require("express");
const app=express();
const path=require("path");
const port=4000;
const methodOverride=require("method-override");

// prerequisites for the views and method
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

// applying the mongoose section 
const mongoose = require('mongoose');

main()
.then(()=>{console.log("mongo running")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/patient_tracker');
}

//including the schemas 
const records=require("./models/records");

// routing 
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
    let {doctor_name,doctor_gender,doctor_age,doctor_phone,patient_caseNo, date,chief_complaint,physical_examination,history_of_illness,diagnosis,blood_pressure,respiratory_rate, capillary_refill,temperature,weight,pulse_rate,medication_treatment,physical_number}=req.body;
    let  patient_records= new records({
      doctor_name:doctor_name,
      doctor_gender:doctor_gender,
      doctor_age:doctor_age,
      doctor_phone:doctor_phone,
      patient_caseNo:patient_caseNo,
      date:date,
      chief_complaint:chief_complaint,
      physical_examination:physical_examination,
      history_of_illness:history_of_illness,
      diagnosis:diagnosis,
      blood_pressure:blood_pressure,
      respiratory_rate:respiratory_rate,
      capillary_refill:capillary_refill,
      temperature:temperature,
      weight:weight,
      pulse_rate:pulse_rate,
      medication_treatment:medication_treatment,
      physical_number:physical_number,
    })
    patient_records.save()
    .then((res)=>{
      console.log("records data saved successfully");
    })
    res.redirect("/dashboard");
})




app.listen(port,()=>{
    console.log(`server is running `);
    
});