const mongoose = require('mongoose')
const validator = require('validator')
const roles = require('../utils/roles')

const AgentSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: [validator.isEmail,"Field must be a valid email address"]
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:roles.AGENT,
        enum:[roles.ADMIN,roles.AGENT]
    },
    birthdate:{
        type:Date,
        required:true
    },
    country:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    zipcode:{
        type:Number,
        require:true
    },
    phone:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:['Male','Female'],
        default:'Male',
    },
    avatar:{
        type:String,
        default:'uploads/profile.png'
    }
})

module.exports = mongoose.model('Agent',AgentSchema)