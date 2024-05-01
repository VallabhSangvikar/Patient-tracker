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
        type:String,
        required:true
    },
    start_time:{
        type:String,
    },
    end_time:{
        type:String,
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

const list= new mongoose.model("list",doctorSchema);
module.exports= list;