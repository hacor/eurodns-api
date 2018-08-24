class Domain {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     *  Check if a domain or domain names are available
     *
     * @param name      String or Array     Required    The string or array of domain names to look up
     * @param cb
     * @returns domains Array                           An Array containing all domains and whether their available
     */
    check (name, cb) {
        if (!name || typeof name === 'function') {
            return cb(new Error('Please provide a domain name to check'))
        }

        // Validate the domain name
        if (typeof name === 'string' && !this.validateDomainName(name)) return cb(new Error('Please provide a correct domain name'))
        if (name instanceof Array ) {
            let error = false

            name.forEach( domain => {
                if (!this.validateDomainName(domain)) error = true
            })

            if (error) return cb(new Error('Please provide only valid domain names'))
        }

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:domain="http://www.eurodns.com/domain">
                <domain:check>
                    ${this.parseDomainArray(name)}
                </domain:check>
            </request>`;

        this.request(reqData, (err, res) => {
            let json = []
            if ( res.check && res.check.cd && !res.check.cd.length) {
                // A single domain was validated
                json.push({
                    available: JSON.parse(res.check.cd.name._avail),
                    domain: res.check.cd.name.__text
                })
            } else if (res.check && res.check.cd && res.check.cd.length && res.check.cd.length > 0) {
                // Multiple domains were validated
                res.check.cd.forEach(domain => {
                    json.push({
                        available: JSON.parse(domain.name._avail),
                        domain: domain.name.__text
                    })
                })
            }

            cb(err ? err : null, json);
        })
    }

    add (domain) {

        if (!domain.name) return cb(new Error('Provide a domain name'))
        if (!domain.subscriptionPeriod) domain.subscriptionPeriod = 1


        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request
                xmlns:domain="http://www.eurodns.com/domain"
                xmlns:nameserver="http://www.eurodns.com/nameserver"
                xmlns:contact="http://www.eurodns.com/contact"
                xmlns:company="http://www.eurodns.com/company"
                xmlns:extension="http://www.eurodns.com/extension"
                xmlns:secdns="http://www.eurodns.com/secdns"
                xmlns:nameserverprofile="http://www.eurodns.com/nameserverprofile"
                xmlns:zoneprofile="http://www.eurodns.com/zoneprofile">
            
                <domain:create>
                    <domain:name>#DOMAIN.TLD#</domain:name>
                    <domain:year>#SUBSCRIPTION PERIOD#</domain:year>
                    <domain:renewal>#RENEWAL MODE#</domain:renewal>
                    <domain:folderid>#DOMAIN FOLDERID#</domain:folderid>
                    <nameserverprofile:id>#NAMESERVER PROFILEID#</nameserverprofile:id>
                    <zoneprofile:id>#ZONE PROFILEID#</zoneprofile:id>
                </domain:create>
            
                <nameserver:create>
                    <nameserver:priority>#PRIORITY#</nameserver:priority>
                    <nameserver:fqdn>#FULLY QUALIFIED DOMAIN NAME#</nameserver:fqdn>
                    <nameserver:ipaddr>#IP ADDRESS#</nameserver:ipaddr>
                </nameserver:create>
            
                <contact:create>
                    <contact:type>#TYPE#</contact:type>
                    <contact:contactprofileid>#CONTACT PROFILE ID#</contact:contactprofileid>
                    <contact:firstname>#FIRSTNAME#</contact:firstname>
                    <contact:lastname>#LASTNAME#</contact:lastname>
                    <contact:company>#COMPANY#</contact:company>
                    <contact:address1>#ADDRESS LINE 1#</contact:address1>
                    <contact:address2>#ADDRESS LINE 2#</contact:address2>
                    <contact:address3>#ADDRESS LINE 3#</contact:address3>
                    <contact:city>#CITY#</contact:city>
                    <contact:zipcode>#ZIP/POSTAL CODE#</contact:zipcode>
                    <contact:country_code>#COUNTRY CODE#</contact:country_code>
                    <contact:email>#EMAIL ADDRESS#</contact:email>
                    <contact:phone>#PHONE NUMBER#</contact:phone>
                    <contact:fax>#FAX NUMBER#</contact:fax>
                </contact:create>
            
                <extension:claims>
                    <extension:noticeid>#NOTICE ID#</extension:noticeid>
                    <extension:lookupkey>#CLAIM KEY#</extension:lookupkey>
                    <extension:accepteddate>#ACCEPTED DATE#</extension:accepteddate>
                    <extension:ip>#IP#</extension:ip>
                </extension:claims>
            
                <extension:create>
                    <extension:secdns>
                        <secdns:keydata>
                            <secdns:flag>#FLAG#</secdns:flag>
                            <secdns:protocol>#PROTOCOL#</secdns:protocol>
                            <secdns:algorithm>#ALGORITHM#</secdns:algorithm>
                            <secdns:publickey>#PUBLIC KEY#</secdns:publickey>
                        </secdns:keydata>
                    </extension:secdns>
                </extension:create>
            
                <extension:create>
                    <extension:service>
                        <service:domainprivacy>#WHOIS PRIVACY#</service:domainprivacy>
                    </extension:service>
                </extension:create>
            </request>`
    }

    /**
     * This function checks if a provided domain name is valid or not
     * @param domain
     * @returns {boolean}
     */
    validateDomainName (domain) {

        if (/^([a-zA-Z0-9]+(([\-]?[a-zA-Z0-9]+)*\.)+)*[a-zA-Z]{2,}$/.test(domain)) {
            return (true)
        }
        return (false)
    }

    /**
     * This function returns an XML list of domain(s) to send to the API server
     *
     * @param domains       String or Array     Required
     * @returns {*}
     */
    parseDomainArray(domains) {
        if (typeof domains === 'string') {
            return `<domain:name>${domains}</domain:name>`
        } else if (domains instanceof Array) {
            let domainList = []
            domains.forEach( domain => {
                domainList.push(`<domain:name>${domain}</domain:name>`)
            })

            return domainList.join('')
        }
    }
}

module.exports = Domain;
