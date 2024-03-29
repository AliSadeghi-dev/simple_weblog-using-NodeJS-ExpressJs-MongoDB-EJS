const mongoose = require('mongoose');

const {schema} = require('./secure/userValidation');

const UserSchema =new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:4,
        maxlength:255
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

UserSchema.statics.userValidation=function(body){
    return schema.validate(body,{abortEarly:false})
}


const user = mongoose.model("User",UserSchema);

module.exports=user;