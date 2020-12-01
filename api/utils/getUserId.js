const jwt = require('./jwt');
const User = require("../models/user");

exports.userId = async (token, callback) => {
    token = await jwt.verfiyToken(token);
    if (token) {
        const user = User.getUserByProp(token._id);
        if (user) return callback(token._id);
    }
    else {
        return callback(null);
    }
}