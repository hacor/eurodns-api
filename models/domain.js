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

    /**
     * Create a domain
     * https://agent.api-eurodns.com/documentation/http/domain/create/information.php
     *
     * @param   domain                      Required    Object      The domain create object
     *          domain.name                 Required    String      The domain to create (including TLD)
     *          domain.subscriptionPeriod   Required    Number      The subscription persiod
     *          domain.renewalPeriod        Optional    String      can be 'autorenew' or 'autoexpire"
     *          domain.folderId             Optional    String      The ID of the folder to put the domain into
     *          domain.nameserverProfileId  Optional    String      The ID of the name server profile to user
     *          domain.zoneProfileId        Optional    String      The ID of the zoneProfile to attach to the domain
     *          domain.nameservers          Optional    Array       An array of nameservers to use (when the domain.nameserverProfileId is not defined)
     *              nameserver.priority     Required    Number      The priority of the nameserver
     *              nameserver.fqdn         Required    String      The FQDN of the name server
     *              nameserver.ip           Required    String      The IP address of the name server
     *          domain.contacts             Required    Array       Must be an array of 4 items
     *              contacts.type           Required    String      You need the 4 types: admin, billing, tech, org
     *              contacts.profileId      Required    String      The contactProfileId to use (instead of defining the complete contact model)
     *              (all other fields see the contact profile)
     *          domain.claim                Optional    Object
     *              claim.noticeId          Required    String      The Notice Id
     *              claim.key               Required    String      The claim key of the domain
     *              claim.accepted          Required    String      The accepted date (epoch timestamp)
     *              claim.ip                Required    String      Client IP address
     *          domain.whoisPrivacy         Optional    Boolean     Activate Whois privacy on this domain
     * @returns {*}
     */
    add (domain) {

        if (!domain.name) return cb(new Error('Provide a domain name'))
        if (!domain.subscriptionPeriod) domain.subscriptionPeriod = 1
        if (domain.nameserverProfileId && domain.nameservers && domain.nameservers.length > 0) return cb(new Error('Seems you provided a Nameservers array AND a nameservprofileId. This is not accepted'))
        if (!domain.nameserverProfileId && !domain.nameservers) return cb(new Error('Please provide domain.nameserverProfileId or a domain.nameservers Array'))
        if (!domain.contacts  || (domain.contacts && domain.contacts < 4)) return cb(new Error('Please provide domain.contacts with 4 type elements: admin, billing, tech and org '))

        if (domain.nameservers && domain.nameservers.length > 0) {
            domain.nameservers.forEach( nameserver => {
                if (!nameserver.priority || !nameserver.fqdn || !nameserver.ip) return cb(new Error('Each nameserver must have a priority, fqdn and ip field!'))
            })
        }
        if (domain.claim) {
            if (!domain.claim.noticeId) return cb(new Error('The claim field must contain a noticeId field'))
            if (!domain.claim.key) return cb(new Error('The claim field must contain a key field'))
            if (!domain.claim.accepted) return cb(new Error('The claim field must contain an accepted field in epoch timestamp format'))
            if (!domain.claim.ip) return cb(new Error('The claim field must contain an ip field'))
        }

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
                    <domain:name>${domain.name}</domain:name>
                    <domain:year>${domain.subscriptionPeriod}</domain:year>
                    <domain:renewal>${domain.renewalPeriod}</domain:renewal>
                    ${domain.folderId ? '<domain:folderid>' + domain.folderId + '</domain:folderid>' : '' }
                    ${domain.nameserverProfileId ? '<nameserverprofile:id>' + domain.nameserverProfileId + '</nameserverprofile:id>' : '' }
                    ${domain.zoneProfileId ? '<zoneprofile:id>' + domain.zoneProfileId + '</zoneprofile:id>' : '' }
                </domain:create>
            
                ${this.parseNameservers(domain.nameservers)}
            
                ${this.parseContacts(domain.contacts)}
            
                ${this.parseClaim(domain.claim)}
            
                <extension:create>
                    <extension:service>
                        <service:domainprivacy>${domain.whoisPrivacy ? 'Yes': 'No'}</service:domainprivacy>
                    </extension:service>
                </extension:create>
            </request>`

        this.request(reqData, (err, res) => {

            // strange result code
            if (err) return cb(err)

            cb(null, res)
        })
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

    /**
     * This function parses the JSON array of nameservers into the needed XML strings
     *
     * @param nameservers       Array   An Array of nameserver objects
     * @returns {string}        String  The XML content of the nameservers
     */
    parseNameservers (nameservers) {
        let xml = ''
        if (nameservers && nameservers.length > 0) {
            nameservers.forEach( nameserver => {
                xml +=
                    `<nameserver:create>
                        <nameserver:priority>${nameserver.priority}</nameserver:priority>
                        <nameserver:fqdn>${nameserver.fqdn}</nameserver:fqdn>
                        <nameserver:ipaddr${nameserver.ip}</nameserver:ipaddr>
                    </nameserver:create>`
            })
        }

        return xml

    }

    /**
     * This function parses the contacts array into EuroDNS ready XML
     *
     * @param contacts          Required        Array       The contacts array
     * @returns {string}                                    The XML
     */
    parseContacts(contacts) {
        let xml = ''

        if (contacts && contacts.length > 0) {
            contacts.forEach(contact => {

                if (contact.contactProfileId && contact.contactProfileId !== '') {
                    // We use a contact with a standard Profile ID
                    xml += `
                 <contact:create>
                    <contact:type>${contact.type}</contact:type>
                    <contact:contactprofileid>${contact.profileId}</contact:contactprofileid>
                </contact:create>`

                } else {
                    // Seems to be full contact info
                    xml +=
                        `<contact:create>
                    <contact:firstname>${contact.firstName}</contact:firstname>
                        <contact:lastname>${contact.lastName}</contact:lastname>
                        ${contact.company ? '<contact:company>' + contact.company + '</contact:company>' : '' }
                        <contact:address1>${profile.addressLine1}</contact:address1>
                        ${contact.addressLine2 ? '<contact:address2>' +  contact.addressLine2 + '</contact:address2>': ''}
                        ${contact.addressLine3 ? '<contact:address3>' +  contact.addressLine3 + '</contact:address3>' : ''}
                        <contact:city>${contact.city}</contact:city>
                        <contact:zipcode>${contact.postalCode}</contact:zipcode>
                        <contact:country_code>${contact.countryCode}</contact:country_code>
                        <contact:email>${contact.email}</contact:email>
                        <contact:phone>${contact.phone}</contact:phone>
                        ${contact.fax ? '<contact:fax>' +  contact.fax + '</contact:fax>' : ''}
                </contact:create>`
                }
            })
        }

        return xml;
    }

    /**
     * This function returns the extension:claims XML field in a domain create call
     * @param claim
     * @returns {string}
     */
    parseClaim(claim) {
        let xml = ''

        if (claim) {
            xml += `
                <extension:claims>
                    <extension:noticeid>${claim.noticeId}</extension:noticeid>
                    <extension:lookupkey>${claim.key}</extension:lookupkey>
                    <extension:accepteddate>${claim.accepted}</extension:accepteddate>
                    <extension:ip>${claim.ip}</extension:ip>
                </extension:claims>`
        }

        return xml;
    }

}

module.exports = Domain;
