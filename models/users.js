const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");


const userSchema=new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
})

userSchema.plugin(passportLocalMongoose);   

 const user= new mongoose.model("user",userSchema);
 module.exports= user ;