const axios = require('axios')

exports.request = function (reqData, cb) {
    const api = this;

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
        }
    }

    axios.post(api.config.uri, reqData, params)
        .then( response => {

            cb(null, api.x2js.xml2js(response))

        }, err => {

            cb(err);
        })
}
