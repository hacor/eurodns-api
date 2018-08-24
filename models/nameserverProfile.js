class NameserverProfile {
    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * Lists all the nameservers in your account
     *
     * TODO:: Doesn't seem to work! Returns a 2301 status code
     * [Module [Nameserverprofile:list] does not exist]
     * @param cb
     */
    list (cb) {
        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:nameserverprofile="http://www.eurodns.com/nameserverprofile">
                <nameserverprofile:list/>
            </request>`

        this.request(reqData, (err, res) => {
            cb(err ? err : null, res)
        })
    }
}

module.exports = NameserverProfile