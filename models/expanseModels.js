const mongoose=require("mongoose");
// const plm=require("passport-local-mongoose");

const expanseModels= new mongoose.Schema({
    amount:Number,
    remark:String,
    Category:String,
    paymentmode:{
        type:String,
        enum:["cash","online","cheque"],
    },
    user:[{type:mongoose.Schema.Types.ObjectId , ref:"user"}]

},{timestamps:true})

// userModels.plugin(plm);
module.exports = mongoose.model("expanse",expanseModels);