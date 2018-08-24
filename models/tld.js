class TLD {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * List all active top level domains
     *
     * https://agent.api-eurodns.com/documentation/http/tld/list/
     *
     * @return  Array   An array of TLDs
     */
    list (cb) {
        const reqData =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<request xmlns:policy="http://www.eurodns.com/policy">\n' +
            '    <tld:list/>\n' +
            '</request>'

        this.request(reqData, (err, res) => {
            cb(err ? err.code : null, this.tldListParser(res));
        })
    }

    /**
     * This function parses the XML array answered by the server into a javascript array of tlds
     *
     * https://agent.api-eurodns.com/documentation/http/ip/add/
     *
     * @param xml
     */
    tldListParser(json) {
        const tlds = [];

        if (json && json.list && json.list.name && json.list.name.length > 0) {
            json.list.name.forEach(tld => {
                tlds.push(tld.__text);
            })
        }

        return tlds

    }
}

module.exports = TLD;
