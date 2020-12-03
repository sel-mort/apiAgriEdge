const bulk = require('node-bulk-sms');
const random = require('random');

exports.verificationPhone = (phone, callback) => {
    try {
        bulk.setUsername(process.env.BULKSMS_USERNAME);
        bulk.setPassword(process.env.BULKSMS_PASSWORD);
        console.log(process.env)
        const code = random.int(1111, 9999);
        bulk.sendMessage('Votre code de validation pour finir votre inscription sur Agrisamad est: '+ code +'. https://www.agrisamad.com/', 
            phone, (result) => {
                try {
                    console.log(result)
                    if (result.body.split('|')[1] != 'IN_PROGRESS')
                        callback(false, code);
                    else
                        callback(true, code);

                } catch (err) {
                    console.log(err)
                    callback(false, code);
                }
            });
        // verification phone here
    } catch (err) {
        console.log(err);
        callback(false, code);
    }
}