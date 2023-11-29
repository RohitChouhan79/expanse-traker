const mongoose=require("mongoose");
const plm=require("passport-local-mongoose");

const userModels= new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required: [true, "Username is required!"],
        minLength: [4, "Username field must have atleast 4 characters"],
    },
    email:{
        type:String,
        lowercase:true,
        required:[true,"Email is required!"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password:{
        type:String,
    },
    resetPasswordotp:{
        type:String,
        default:-1,
    }
})

userModels.plugin(plm);
module.exports("User",userModels);