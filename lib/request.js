const request = require('request')
const crypto = require('crypto-js')

exports.request = function (reqData, cb) {
    const api = this;

    // Create the fields for the Authorization header
    const md5passw = 'MD5' + crypto.MD5(this.config.password).toString()
    const credentials = 'Basic ' + Buffer.from(`${api.config.user}:${md5passw}`).toString('base64')

    // The request options for the EuroDNS api
    const postRequest = {
        url: api.config.uri,
        method: "POST",
        formData: {
            xml: encodeURIComponent(reqData)
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': credentials
        }
    };

    // The post itself
    request.post(postRequest, (err, res) => {

        if  (err) {
            //console.log('EURODNS-API: unable to connect to the API')
            cb(new Error('Unable to connect to the API'))
        } else {
            const json = api.x2js.xml2js(res.body)

            if (json.response && json.response.result) {

                // Time to check the result codes
                if (json.response.result._code && ['1000', '1001'].indexOf(json.response.result._code) > -1 ) {
                    // Return code 1000 or 1001 received

                    let result = json.response.resData

                    if (json.response.extension) result.extension = json.response.extension

                    console.log( 'EURODNS-API: result code 1000 or 1001 ')
                    console.log( 'EURODNS-API: Reponse: ' + JSON.stringify(json.response.resData))
                    cb(null, json.response.resData)

                } else {
                    // Another return code received
                    //console.log( 'EURODNS-API: Seems some other result code: ' + json.response.result._code)
                    //console.log( 'EURODNS-API: Response message: ' + json.response.result.msg)
                    cb(new Error(json.response.result.msg))
                }
            } else {
                // Result field didn't exist in the response
                //console.log( 'EURODNS-API: Result does not exist in the response: ' + JSON.stringify(json) )
                cb(new Error('Result field does not exist in the response'))
            }
        }
    })
}
