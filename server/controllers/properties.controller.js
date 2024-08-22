const Property = require('../models/property.model')
const httpStatus = require('../utils/httpStatus')

const getAllProperties = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;
  
    try {
      const allProperties = await Property.find()
        .skip(skip)
        .limit(parsedLimit);
  
      const total = await Property.countDocuments();
  
      return res.status(200).json({
        status: httpStatus.SUCCESS,
        properties: allProperties,
        page: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        totalProperties: total,
        message: "Properties fetched successfully!",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'fail',
        message: "Couldn't get properties",
      });
    }
  };
  

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
        photo:req.file && req.file.filename,
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