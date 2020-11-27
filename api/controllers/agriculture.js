const utils = require('../utils');

const Agriculture = require('../models/agriculture');

exports.create = (req, res) => {
    try {
        const agriculture = new Agriculture(req.body);

        agriculture.userId = utils.userId(req.headers.authorization.split(' ')[1]);

        agriculture.save();

        return res.status(201).send({
            message: {
              'en': 'created',
              'ar': 'تم الإنشاء',
              'fr': 'créé'
            }
          });

    } catch (err) {
        return res.status(400).send({
            error: {
              'en': 'something went wrong',
              'ar': 'هناك خطأ ما',
              'fr': 'quelque chose s\'est mal passé'
            }
          });
    }
}