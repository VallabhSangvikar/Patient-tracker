const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");


const userSchema=new Schema({
    email:{
        type:String,
    }
})

userSchema.plugin(passportLocalMongoose);   

 const user= new mongoose.model("user",userSchema);
 module.exports= user ;