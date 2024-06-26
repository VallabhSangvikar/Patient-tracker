const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordsSchema = new Schema({
    doctor_name:{
        type:String,
        required:true,
    },
    doctor_gender:{
        type:String,
        required:true,
    },
    doctor_age:{
        type:Number,
        required:true,
    },
    doctor_phone:{
        type:Number,
        required:true,
    },
    patient_caseNo:{
        type:String,
    },
    date:{
        type:String,
        required:true,
    },
    chief_complaint:{
        type:String,
        required:true,
    },
    physical_examination:{
        type:String,
    },
    history_of_illness:{
        type:String,
    },
    diagnosis:{
        type:String,
        required:true,
    },
    blood_pressure:{
        type:Number,
    },
    respiratory_rate:{
        type:Number,
    },
    capillary_refill:{
        type:Number,
    },
    temperature:{
        type:Number,
    },
    weight:{
        type:Number,
    },
    pulse_rate:{
        type:Number,
    },
    medication_treatment:{
        type:String,
        required:true,
    },
    physical_number:{
        type:Number
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const Records= new mongoose.model("Records",recordsSchema)
module.exports=Records;