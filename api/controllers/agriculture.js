const {userId} = require('../utils/getUserId');

const Agriculture = require('../models/agriculture');

exports.create =  (req, res) => {
    try {
        userId(req.headers.authorization.split(' ')[1], async (id) => {
          if (!id) {
            return res.status(401).send({
              notAuthorized: {
                  'ar': "غير مصرح لك",
                  'fr': "pas autorisé",
                  'en': "not authorized"
              }
            });
          }
          else {

            try {
              req.body.userId = id;
              await Agriculture(req.body).save();

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