const Property = require('../models/property.model')
const httpStatus = require('../utils/httpStatus')

const getAllProperties = async(req,res) => {
    const allProperties = await Property.find()
    if(allProperties){
        return res.json({status:httpStatus.SUCCESS,properties:allProperties,message:"Properties fetched successfully!"})
    }else{
        return res.json({status:httpStatus.FAIL,message:'Couldn\'t get properties'})
    }
}

const addProperty = async (req, res) => {
    const { title, description, propertyType, country,state, price, beds, photo, surface, status
     } = req.body;

    

    const newProperty = new Property({
        title,
        description,
        propertyType,
        country,
        state,
        price,
        beds,
        photo,
        surface,
        status,
        creator: req.currentUser.payload.user._id
    });

    try {
        await newProperty.save();
        return res.status(201).json({ status: 'SUCCESS', property: newProperty, message: 'Property added successfully!' });
    } catch (err) {
        return res.status(500).json({ status: 'FAIL', message: err.message });
    }
};




module.exports = {
    getAllProperties,
    addProperty
}