class Domain {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    check (name, cb) {
        if (!name || typeof name === 'function') {
            return cb('Please provide a domain name to check')
        }

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:domain="http://www.eurodns.com/domain">
                <domain:check>
                    <domain:name>${name}</domain:name>
                </domain:check>
            </request>`;

        this.request(reqData, (err, res) => {
            cb(err ? err : null, res);
        })
    }
}

module.exports = Domain;
