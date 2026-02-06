const mongoose = require("mongoose")

const connectDB = ()=>{
    mongoose.connect(`${process.env.MONGODB_URI}/Pinterest`).then(()=>{
        console.log("Connected To Database")
    })
}
module.exports = connectDB;