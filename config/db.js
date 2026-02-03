const mongoose = require("mongoose")

const connectDB = ()=>{
    mongoose.connect("mongodb://localhost:27017/Clone-Pintrest").then(()=>{
        console.log("Connected To Database")
    })
}
module.exports = connectDB;