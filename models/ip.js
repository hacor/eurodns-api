class IP {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * Get the list of IP addresses who are granted API access
     *
     * https://agent.api-eurodns.com/documentation/http/ip/list/
     *
     * @return  Array   An array of IP addresses
     */
    list (cb) {
        const reqData =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<request xmlns:ip="http://www.eurodns.com/ip">\n' +
            '    <ip:list/>\n' +
            '</request>'

        this.request(reqData, (err, res) => {
            cb(err ? err.code : (null, this.ipListParser(res)));
        })
    }

    /**
     * Add an IP address to the list of IPs on the server who are granted API access
     *
     * https://agent.api-eurodns.com/documentation/http/ip/add/
     *
     * @param ip        String      Required    A new IP address to add
     * @param cb        Function    Required    The callback function
     * @return {*}
     */
    add (ip, cb) {

        if (!ip || typeof ip === 'function') {
            return cb('Please provide a proper IP address')
        }

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
             <request xmlns:ip="http://www.eurodns.com/ip">
                <ip:add>
                    <ip:address>${ip}</ip:address>
                </ip:add>
            </request>`;

        this.request(reqData, (err, res) => {
            cb(err ? err.code : (null, this.x2js.xml2js(res)));
        })
    }

    /**
     * Remove an IP on the server to disallow API access
     *
     * https://agent.api-eurodns.com/documentation/http/ip/remove/
     *
     * @param ip    String  Required    The IP address to delete
     * @param cb
     */
    remove(ip, cb) {

        if (!ip || typeof ip === 'function') {
            return cb('Please provide a proper IP address')
        }

        const reqData = `
            <?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:ip="http://www.eurodns.com/ip">
                <ip:remove>
                    <ip:address>${ip}</ip:address>
                </ip:remove>
            </request>`

        this.request(reqData, (err, res) => {
            cb(err ? err.code : (null, this.x2js.xml2js(res)));
        })
    }

    /**
     * This function parses the XML array answered by the server into a javascript array of addresses
     *
     * https://agent.api-eurodns.com/documentation/http/ip/add/
     *
     * @param xml
     */
    ipListParser(xml) {
        const json = this.x2js.xml2js(xml)
        const addresses = [];

        if (json.resData && json.resData.list && json.resData.list.address && json.resData.list.address.length > 0) {
            json.resData.list.address.forEach(address => {
                addressess.push(address.__text);
            })
        }

        return addresses

    }
}

module.exports = IP;
