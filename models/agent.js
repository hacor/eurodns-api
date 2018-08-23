class Agent {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * Get the current balance of your account
     */
    balance (cb) {
        const reqData = '' +
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<request xmlns:agent="http://www.eurodns.com/agent">\n' +
            '    <agent:balance/>\n' +
            '</request>'

        this.request(reqData, (err, res) => {
            cb(err ? err.code : (null, this.balanceParser(res)));
        })
    }

    /**
     * This function returns an object based on the retrieved XML by the server
     *
     * @returns { currency: "EUR", amount: Number }
     * @param xml
     */
    balanceParser(xml) {
        const json = this.x2js.xml2js(xml)

        return {
            currency: json.resData.balance._currency,
            amount: json.resData.balance.__text
        }
    }
}

module.exports = Agent;
