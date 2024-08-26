const express = require('express');
const Router = express.Router();
const agentController = require('../controllers/agents.controller');
const multer  = require('multer')
const verifyToken = require('../middlewares/verifyToken')

const diskStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split('/')[1]
        const filename = `user-${Date.now()}.${ext}`
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

Router.route('/register')
    .post(upload.single('avatar'),agentController.register);
Router.route('/login')
    .post(agentController.login);
Router.route('/user')
    .post(agentController.getUser);
Router.route('/agents')
    .get(verifyToken,agentController.getAllAgents);
Router.route('/agents/:id')
    .get(verifyToken,agentController.getAgent)

module.exports = Router;
