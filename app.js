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

const lists = require("./models/doctors");

// routing 
app.get("/",(req,res)=>{
  res.render("login.ejs");
})
app.get("/login",(req,res)=>{
  res.render("login.ejs");
})
app.get("/details/:id",async(req,res)=>{
  let {id}=req.params;
  let recordinfo=await records.findById(id);
  res.render("details.ejs",{id,recordinfo});
})
app.get("/dashboard",async(req,res)=>{
  let details=await records.find();
  res.render("dashboard.ejs",{details});
})
app.get("/addrecord",(req,res)=>{
  res.render("addRecord.ejs");
})
app.get("/doctors",(req,res)=>{
  res.render("addDoctor.ejs");
})
app.get("/doctorslist",async(req,res)=>{
  let list= await lists.find(); 
  res.render("doctorslist.ejs",{list});
})
app.get("/doctordetails/:id",async(req,res)=>{
  let {id}= req.params;
  let doctorinfo=await lists.findById(id);
  res.render("doctordetail.ejs",{doctorinfo});
});
//app.post 
app.post("/dashboard",async(req,res)=>{
    let {doctor_name,doctor_gender,doctor_age,
        doctor_phone,patient_caseNo,date,
        chief_complaint,physical_examination,history_of_illness,
        diagnosis,blood_pressure,respiratory_rate, capillary_refill,
        temperature,weight,pulse_rate,medication_treatment,physical_number}=req.body;

        const formattedDate = new Date(date).toISOString().slice(0, 10);

    let  patient_records= new records({
      doctor_name:doctor_name,
      doctor_gender:doctor_gender,
      doctor_age:doctor_age,
      doctor_phone:doctor_phone,
      patient_caseNo:patient_caseNo,
      date:formattedDate,
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
    await patient_records.save()
    .then((res)=>{
      console.log("records data saved successfully");
    })
    let details= await records.find();
    res.render("dashboard.ejs",{details});
})

app.post("/doctorlist",async(req,res)=>{

    let {hospital_name,doctor_name,age,gender,date_added,
        start_time,end_time,specialization,qualification,
        experience,contact}=req.body;
        const formattedDate2 = new Date(date_added).toISOString().slice(0, 10);
    let listing=new lists({
      hospital_name:hospital_name,
      doctor_name:doctor_name,
      age:age,
      gender:gender,
      date_added:formattedDate2,
      start_time:start_time,
      end_time:end_time,
      specialization:specialization,
      qualification:qualification,
      experience:experience,
      contact:contact,
    })
    await listing.save()
    .then((res)=>{
      console.log("doctors list saved successfully");
    })
    let list= await lists.find();
    res.render("doctorslist.ejs",{list});
})

app.delete("/doctorslist/:id",async(req,res)=>{
  let {id}=req.params;
  await lists.findByIdAndDelete(id);
  res.redirect("/doctorslist");

})


app.post("/",(req,res)=>{
  console.log(req.body);
})



app.listen(port,()=>{
    console.log(`server is running `);
    
});