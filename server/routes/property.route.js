const express = require('express')
const Router = express.Router()
const propertiesController = require('../controllers/properties.controller')
const verifyToken = require('../middlewares/verifyToken')

Router.route('/properties')
    .get(verifyToken,propertiesController.getAllProperties)
    .post(verifyToken,propertiesController.addProperty)

module.exports = Router