const jwt = require('jsonwebtoken');

module.exports = (payload) => {
    const token = jwt.sign(
        {payload},
        process.env.SECRET_KEY, // Ensure this is set in your environment variables
    );
    return token;
};
