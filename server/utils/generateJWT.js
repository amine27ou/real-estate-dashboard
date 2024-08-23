const jwt = require('jsonwebtoken');

module.exports = (payload) => {
    const token = jwt.sign(
        {payload},
        process.env.SECRET_KEY,
        {expiresIn:'5d'}
    );
    return token;
};
