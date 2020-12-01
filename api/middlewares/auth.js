exports.isAuth = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return next();
    }
    else {
        return res.status(401).send({
            notAuthorized: {
                'ar': "غير مصرح لك",
                'fr': "pas autorisé",
                'en': "not authorized"
            }
        });
    }
}