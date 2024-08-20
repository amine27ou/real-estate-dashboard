const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config()
const agentRouter = require('./routes/agent.route')
app.use('/api/v1/',agentRouter)
const propertiesRouter = require('./routes/property.route')
app.use('/api/v1/',propertiesRouter)
const path = require('path')
app.use("/uploads",express.static(path.join(__dirname,'uploads')))




app.listen(process.env.PORT || 8080,()=>{
    console.log("connected to port:" , process.env.PORT)
})
mongoose.connect(process.env.CONNECTION_STR).then(()=>{
    console.log("connected to database")
})
