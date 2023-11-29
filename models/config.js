const mongoose=require("mongoose");

mongoose
.connect("mongodb://127.0.0.1:27017/expanse-traker")
.then(()=>console.log("DB Connected"))
.catch((error)=>console.log(error.message))