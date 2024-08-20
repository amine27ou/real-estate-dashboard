const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    propertyType: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: false },
    price: { type: Number, required: true },
    beds:{type:Number,required:true},
    photo: { type: String,required:true  },
    surface: { type: Number, required: true }, 
    status:{type:String,required:true},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },
})

module.exports = mongoose.model('Property',propertySchema)