const Property = require('../models/property.model')
const Agent = require('../models/agent.model')
const httpStatus = require('../utils/httpStatus')

const getAllProperties = async (req, res) => {
  const { page = 1, limit = 10, ...searchFilter } = req.query;
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  try {
    let query ={}
    if (Object.values(searchFilter).some(prop => prop)) {
      query = Object.entries(searchFilter)
        .filter(([key, value]) => value)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }

    const allProperties = await Property.find(query)
      .skip(skip)
      .limit(parsedLimit);
    const total = await Property.countDocuments(query);

    return res.status(200).json({
      status: 'success',
      properties: allProperties,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      totalProperties: total,
      message: 'Properties fetched successfully!',
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
        return res.status(201).json({ status: httpStatus.SUCCESS, property: newProperty, message: 'Property added successfully!' });
    } catch (err) {
        return res.status(500).json({ status: httpStatus.FAIL, message: err.message });
    }
};

const updateProperty = async (req, res) => {
  try {
      const propertyId = req.params.id;
      const updatedData = { ...req.body };

      if (req.file) {
          updatedData.photo = req.file.filename; 
      }

      const updatedProperty = await Property.findByIdAndUpdate(propertyId, updatedData, { new: true });

      if (!updatedProperty) {
          return res.status(404).json({ status: 'Fail', message: 'Property not found' });
      }

      res.status(200).json({ status: 'Success', message: 'Property updated successfully', property: updatedProperty });
  } catch (err) {
      res.status(500).json({ status: 'Fail', message: err.message });
  }
};






const getProperty = async (req,res)=>{
  const propertyId = req.params.id;
  
  try{
    if(propertyId){
      const property = await Property.findById(propertyId);
      return res.status(200).json({status:httpStatus.SUCCESS,message:'Property fetched successfully!',property:property})
    }else{
      return res.status(404).json({status:httpStatus.FAIL,message:'Property Not Found !'})
    }
  }catch(err){
    return res.json({status:httpStatus.ERROR,message:'An Error Has Occured !'})
  }

}


const deleteProperty = async(req,res)=>{
  const propertyId = req.params.id
  try{
    await Property.deleteOne({_id:propertyId})
    return res.json({status:httpStatus.SUCCESS,message:'Property Deleted Successfully!'})
  }catch(err){
    return res.status(400).json({status:httpStatus.FAIL,message:err.message})
  }
}

const generalData = async(req,res)=>{
  try{
    const propertiesForRent = await Property.countDocuments({ status: 'rent' });
    const propertiesForSell = await Property.countDocuments({ status: 'sell' });
    const totalAgents = await Agent.countDocuments();
    const totalProperties = await Property.countDocuments();
    return res.json({status:httpStatus.SUCCESS,dashboard_data:{propertiesForRent,propertiesForSell,totalAgents,totalProperties}})

  }catch(err){
    return res.status(400).json({status:httpStatus.FAIL,message:err.message})
  }
}

module.exports = {
    getAllProperties,
    addProperty,
    getProperty,
    updateProperty,
    deleteProperty,
    generalData
}