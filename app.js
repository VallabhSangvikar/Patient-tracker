const express=require("express");
const app=express();
const path=require("path");
const port=4000;
const methodOverride=require("method-override");
const session=require("express-session");
const cookieParser=require("cookie-parser");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/users");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// session requisites

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 
//including the schemas 
const records=require("./models/records");

const lists = require("./models/doctors");


// middlewares

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.user=req.user;
  next();
});

const LoggedIn=((req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash("error","please login to go further");
    return res.redirect("/login");
  }
  next();
})

app.use("/doctordetails/:id",async(req,res,next)=>{
  let {id}=req.params;
  let doctor=await lists.findById(id);
  if(doctor && doctor.length !=0){
    next();
  }else{
    try {
      let list= await lists.find({owner:req.user.id}); 
      res.render("doctorslist.ejs",{list,error:"doctor doesn't exist"});
    } catch (error) {
      req.flash("error","something went wrong");
      res.redirect("/doctorslist")
    }
  }
})

// prerequisites for the views and method
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
const MongoUrl=process.env.ATLAS_URL
// applying the mongoose section 
const mongoose = require('mongoose');

main()
.then(()=>{console.log("mongo running")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MongoUrl);
}

//email verification
const transporter = nodemailer.createTransport({
  service: 'codecrafters.alliance@gmail.com', // Change this to your email service provider
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});
const token = jwt.sign({ data: 'Token Data' }, process.env.JWT_SECRET, { expiresIn: '5m' });
const verifycode=Math.floor((Math.random()*1000000))+100000;
const emailTemplate = `
<html>
  <body>
    <h1>Email Verification</h1>
    <p>Hi there!</p>
    <p>You have recently visited our website and entered your email. This is your verification code :</p>
    <h2>${verifycode}</h2>
    <p>Thanks!</p>
  </body>
</html>
`;
const mailOptions = {
  from: process.env.EMAIL_SENDER,
   // Replace with the user's email
  subject: 'Email Verification',
  html: emailTemplate // Use HTML template for better formatting
};
async function sendVerificationEmail(email) {
  try {
    mailOptions.to=email;
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    // Handle error appropriately (e.g., return error message, retry, etc.)
  }
}


// routing 
app.get("/",(req,res)=>{
  res.render("signup.ejs");
})
app.get("/signup",(req,res)=>{
  res.render("signup.ejs");
})
app.get("/details/:id",LoggedIn,async(req,res)=>{
  let {id}=req.params;
  let recordinfo=await records.findById(id);
  res.render("details.ejs",{id,recordinfo});
})
app.get("/about",LoggedIn,(req,res)=>{
  res.render("about.ejs");
})

app.get("/dashboard",LoggedIn ,async (req, res) => {
  let details = await records.find({owner:req.user.id});
  res.render("dashboard.ejs", { details,user:req.user});
});

app.get("/addrecord",LoggedIn,(req,res)=>{
  res.render("addRecord.ejs");
})
app.get("/doctors",LoggedIn,(req,res)=>{
  res.render("addDoctor.ejs");
})
app.get("/doctorslist",LoggedIn,async(req,res)=>{
  let list= await lists.find({owner:req.user.id}); 
  res.render("doctorslist.ejs",{list});
})
app.get("/doctordetails/:id",LoggedIn,async(req,res)=>{
  let {id}= req.params;
  let doctorinfo=await lists.findById(id);
  req.flash("error","doctor doesn't exist");
  res.render("doctordetail.ejs",{doctorinfo});
});

app.get("/edit/:id",LoggedIn,async(req,res)=>{
  let {id}=req.params;
  let editinfo=await records.findById(id);
  res.render("editRecord.ejs",{editinfo,id});
})
app.get("/login",(req,res)=>{
  res.render("login.ejs");
})
app.get("/verify",(req,res)=>{
  if(!req.user){
    res.render("verify.ejs")
  }else{
    req.flash("error","you already logged in")
    res.redirect("/dashboard");
  }
})

app.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","You are logged Out!");
    res.redirect("/login");
  })
})

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
    });
    try {
      patient_records.owner=req.user.id;
      await patient_records.save()
      .then((res)=>{
        console.log("records data saved successfully");
        req.flash("success","details added successfully");
      }).catch((e)=>req.flash("error","something went wrong"));
      res.redirect("/dashboard");
    } 
    catch (error) {
      req.flash("error","something went wrong");
      res.redirect("/dashboard");
    }
    
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
    try {
      listing.owner=req.user.id;
      await listing.save()
      .then((res)=>{
        console.log("doctors list saved successfully");
      })
      req.flash("success","Doctor details added Successfully");
      res.redirect("/doctorslist");
    } 
    catch (error) {
      req.flash("error","something went wrong");
      res.redirect("/doctorslist");
    }
})

app.post("/signup",async(req,res)=>{
  
    let {email,username,password}=req.body;

    sendVerificationEmail(email);

      req.flash("success","verify your email here by entering the verification code");
      res.render("verify.ejs",{email,username,password});
  
});
app.post("/verify",async(req,res)=>{
  let verify=parseInt(req.body.verificationcode)
  if(verifycode===verify){
    try{
      let {username,email,password}=req.body;
      const newuser=new User ({
      username,
      email
    });

      const registeredUser=await User.register(newuser,password);

      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","Successfully registered");
        res.redirect("/dashboard");
      })

    }catch(e){
      req.flash("error","user already registered, Go to login");
      res.redirect("/login");
    }
  }  else{
    req.flash("error","enter a valid verification code");
    res.redirect("/signup");
  }
})


app.delete("/doctorslist/:id",LoggedIn,async(req,res)=>{
  let {id}=req.params;
  await lists.findByIdAndDelete(id);
  req.flash("success","Removed the doctor's detail successfully");
  res.redirect("/doctorslist");
});

app.patch("/dashboard/:id",async(req,res)=>{
  let {id}=req.params;
  await records.findByIdAndUpdate(id,req.body);
  req.flash("success","Edited details successfully");
  res.redirect("/dashboard");
});

app.post("/login",passport.authenticate("local",{
  failureRedirect:"/login",
  failureFlash:true,
}),async (req,res)=>{
  req.flash("success","Welcome back !!"),
  res.redirect("/dashboard");
})

app.listen(port,()=>{
    console.log(`server is running `);
});