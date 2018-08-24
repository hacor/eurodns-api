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
        const reqData =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<request xmlns:agent="http://www.eurodns.com/agent">\n' +
            '    <agent:balance/>\n' +
            '</request>';

        this.request(reqData, (err, res) => {
            if (err) {
                cb(err)
            } else {
                cb(null, this.balanceParser(res))
            }
        })
    }

    /**
     * This function returns an object based on the retrieved XML by the server
     *
     * @returns { currency: "EUR", amount: Number }
     * @param json
     */
    balanceParser(json) {
        return {
            currency: json.balance._currency,
            amount: parseFloat(json.balance.__text)
        }
    }
}

module.exports = Agent;
