const Agent = require('../models/agent.model');
const bcrypt = require('bcrypt');
const httpStatus = require('../utils/httpStatus');
const generateJWT = require('../utils/generateJWT');
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { firstname, lastname, email, password, birthdate, country, state, zipcode, phone, gender } = req.body;
    try {

        const oldUser = await Agent.findOne({ email: email });
        if (oldUser) {
            return res.status(400).json({
                status: httpStatus.FAIL,
                message: 'There is already a user with this email'
            });
        }

        // Hash the password
        const hashedPwd = await bcrypt.hash(password, 10);
        // Create the new user
        const newUser = new Agent({
            firstname,
            lastname,
            email,
            password: hashedPwd,
            birthdate,
            country,
            state,
            zipcode,
            phone,
            gender,
            avatar: req.file ? req.file.filename : 'uploads/profile.png',
        });

        // Generate the JWT token
        const token = await generateJWT(newUser);
        newUser.token = token;

        // Save the user to the database
        await newUser.save();

        // Send the success response
        return res.status(201).json({
            status: httpStatus.SUCCESS,
            message: 'Registered Successfully!',
            data: newUser,
            token: token
        });
    } catch (err) {
        // Log the error for debugging purposes
        console.error('Error in register function:', err);

        // Send an error response
        return res.status(500).json({
            status: httpStatus.FAIL,
            message: 'An error occurred while registering the agent',
            errors: err.message
        });
    }
};

const login = async (req, res) => {
        const {email,password} = req.body
        if(!email && !password){
                return res.json({error:'email and password are required!'})
        }
        const user = await Agent.findOne({email:email})
        if(!user){
                return res.status(404).json({status:httpStatus.FAIL,message:'There is no user with this email!'})
        }
        const matchedPassword = await bcrypt.compare(password,user.password)
        if(user && matchedPassword){
                const token = await generateJWT({user})
                return res.json({status:httpStatus.SUCCESS,message:'You are logged in successfully!',token:token,user:user})
            }
        if(!matchedPassword){
            return res.status(401).json({status:httpStatus.FAIL,message:'Password Incorrect'})
        }
        
};

const getUser = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(403).json({ status: httpStatus.FAIL, message: 'Token is required' });
  }

  try {
    const user = await jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({ status: httpStatus.SUCCESS, data: user });
  } catch (err) {
    return res.status(401).json({ status: httpStatus.FAIL, message: 'Invalid token' });
  }
};



module.exports = {
    register,
    login,
    getUser
};

