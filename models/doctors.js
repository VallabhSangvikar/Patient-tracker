const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema=new Schema({
    hospital_name:{
        type:String,
        required:true
    },
    doctor_name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
    date_added:{
        type:Date,
        required:true
    },
    opd_timing:{
        type:TimeRanges
    },
    specialization:{
        type:String
    },
    qualification:{
        type:String
    },
    experience:{
        type:String
    },
    contact:{
        type:String
    }
})