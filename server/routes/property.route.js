const express = require('express')
const Router = express.Router()
const propertiesController = require('../controllers/properties.controller')
const verifyToken = require('../middlewares/verifyToken')
const multer = require('multer')

const diskStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split('/')[1]
        const filename = `property-${Date.now()}.${ext}`
        cb(null,filename)
    }
})
const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0]
    if(imageType === 'image'){
        return cb(null,true)
    }else{
        return cb({status:'Fail',message:'file must be an image'},false)
    }
}

const upload = multer({storage:diskStorage,fileFilter})

Router.route('/properties')
    .get(verifyToken,propertiesController.getAllProperties)
    .post(upload.single('photo'),verifyToken,propertiesController.addProperty)
Router.route('/properties/:id')
    .get(verifyToken,propertiesController.getProperty)
    .put(upload.single('photo'),verifyToken,propertiesController.updateProperty)
module.exports = Router