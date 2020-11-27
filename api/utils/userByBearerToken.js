const jwt = require('./jwt');

exports.userId = (token) => {
    const token = jwt.verfiyToken(req.headers.authorization.split(' ')[1]);

    if (token) {
        console.log(token);
        return token._id;
    }
    return null;
}