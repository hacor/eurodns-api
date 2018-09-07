const contact = require('./../helpers/contact')
const nameserver = require('./../helpers/nameserver')

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
     *                                                              If not provided nameserverProfileId AND not nameservers array, we use the default EuroDNS nameservers
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
    create (domain, cb) {

        if (!domain.name) return cb(new Error('Provide a domain name'))
        if (!domain.subscriptionPeriod) domain.subscriptionPeriod = 1
        if (domain.nameserverProfileId && domain.nameservers && domain.nameservers.length > 0) return cb(new Error('Seems you provided a Nameservers array AND a nameservprofileId. This is not accepted'))
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
            
                ${nameserver.create(domain.nameservers ? domain.nameservers : null)}
            
                ${contact.create(domain.contacts)}
            
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

            const domain = {
                domain: res.create.name.__text,
                roId: res.create.roid.__text
            }

            cb(null, domain)
        })
    }

    /**
     * Renew an existing domain
     *
     * @param   domain          Required    Object  The main object
     *          domain.name     Required    String  The domain to renew
     *          domain.period   Resquired   Number  The number of years to renew the domain for
     * @param cb
     */
    renew (domain, cb) {
        if (!domain.name) return cb(new Error('The domain.name field is required for the domain.renew action'))
        if (!domain.period) return cb(new Error('The domain.period field is required for the domain.renew action'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:domain="http://www.eurodns.com/domain">
                <domain:renew>
                    <domain:name>${domain.name}</domain:name>
                    <domain:year>${domain.period}</domain:year>
                </domain:renew>
            </request>`

        this.request(reqData, (err, res) => {
            // strange result code
            if (err) return cb(err)

            cb(null, {})
        })
    }

    /**
     * Set the renewal mode for the provided domain
     *
     * @param   domain              Required    Object
     *          domain.name         Required    String      The domain name te set the mode of
     *          domain.autorenew    Optional    Boolean     If this value is true, 'autorenew' will be set, otherwise we use 'autoexpire'
     * @param cb
     * @returns {*}
     */
    setRenewalMode (domain, cb) {
        if (!domain.name) return cb(new Error('The domain.name field is required for the domain.renew action'))
        if (!domain.autorenew) domain.autorenew = false

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:ip="http://www.eurodns.com/">
                <domain:setrenewalmode>
                    <domain:name>${domain.name}</domain:name>
                    <domain:renewal>${domain.autorenew ? 'autorenew': 'autoexpire'}</domain:renewal>
                </domain:setrenewalmode>
            </request>`

        this.request(reqData, (err, res) => {
            // strange result code
            if (err) return cb(err)

            cb(null, {})
        })
    }


    list (domain, cb) {

        if (!domain || typeof domain === 'function') cb = domain;

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:domain="http://www.eurodns.com/domain">
                <domain:list>
                    ${domain.tld ? '<domain:tld>' + domain.tld + '</domain:tld>' : '' }
                    ${domain.folderId ? '<domain:folderid>' + domain.folderId + '</domain:folderid>' : '' }
                    ${domain.status ? '<domain:status>' + domain.status + '</domain:status>' : '' }
                </domain:list>
            </request>`

        this.request(reqData, (err, res) => {
            // strange result code
            if (err) return cb(err)

            let domains = []

            if (res && res.list && res.list.name) {

                //Result exists, is it an array or an object?
                if (res.list.name.length && res.list.name.length > 0) {

                    // Array!
                    res.list.name.forEach(domain =>{
                        domains.push(domain.__text);
                    })
                } else {
                    // Object aka you hav a single domain
                    if (res.list.name.__text) domains.push(res.list.name.__text)
                }

            }

            cb(null, domains)
        })
    }


    info (domain, cb) {

        if (!domain) cb(new Error('Provide a domain name for info'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:domain="http://www.eurodns.com/domain">
                <domain:info>
                    <domain:name>${domain}</domain:name>
                </domain:info>
            </request>`

        this.request(reqData, (err, res) => {
            // strange result code
            if (err) return cb(err)

            const result = {
                domain: res.name.__text,
                roId: res.roid.__text,
                status: {
                    code: res.status._code,
                    text: res.status.__text
                },
                renewal: res.renewal.__text,
                pending: res.pending._status,
                created: new Date(res.crDate.__text),
                updated: new Date(res.upDate.__text),
                expires: new Date(res.expDate.__text)
            }

            if (res.folderid.__text && res.folderid.__text !== '') result.folderId = res.folderid.__text
            if (res.authCode.__text && res.authCode.__text !== '') result.authCode = res.authCode.__text

            if (res.contact && res.contact.length > 0) {
                result.contacts = contact.parseContactIds(res.contact)
            }

            if (res.extension) {

                // Parse the nameservers of the domain
                if (res.extension.domain && res.extension.domain.ns && res.extension.domain.ns.length > 0) {
                    result.nameservers = nameserver.nsToJson(res.extension.domain.ns)
                }

                // Parse the contact validation
                if (res.extension.contact && res.extension.contact.validated) result.contactValidated = res.extension.contact.validated.__text === 'No' ? false : true;

                result.whoisPrivacy = res.extension.service.domainprivacy.__text ==='No' ? false : true;

            }

            cb(null, result)
        })
    }

    update (domain, cb) {

        if (domain.nameserverProfileId && domain.nameservers && domain.nameservers.length > 0) return cb(new Error('Seems you provided a Nameservers array AND a nameservprofileId. This is not accepted'))
        if (domain.nameservers && domain.nameservers.length > 0) {
            domain.nameservers.forEach( nameserver => {
                if (!((nameserver.priority || nameserver.priority === 0)  && nameserver.priority === parseInt(nameserver.priority)) || !nameserver.fqdn || !nameserver.ip) return cb(new Error('Each nameserver must have a priority, fqdn and ip field!'))
            })
        }

        if (!domain.contacts) domain.contacts = []

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request
                xmlns:domain="http://www.eurodns.com/domain"
                xmlns:nameserver="http://www.eurodns.com/nameserver"
                xmlns:nameserverprofile="http://www.eurodns.com/nameserverprofile"
                xmlns:contact="http://www.eurodns.com/contact"
                xmlns:zoneprofile="http://www.eurodns.com/zoneprofile">
                <domain:update>
                    <domain:name>${domain.name}</domain:name>
                    ${domain.folderId ? '<domain:folderid>' + domain.folderId + '</domain:folderid>' : '' }
                    ${domain.nameserverProfileId ? '<nameserverprofile:id>' + domain.nameserverProfileId + '</nameserverprofile:id>' : '' }
                    ${domain.zoneProfileId ? '<zoneprofile:id>' + domain.zoneProfileId + '</zoneprofile:id>' : '' }
                </domain:update>
                
                ${nameserver.update(domain.nameservers)}
                ${contact.update(domain.contacts)}
                
                ${'whoisPrivacy' in domain ? '<extension:create>\n' +
                '                    <extension:service>\n' +
                '                        <service:domainprivacy>' + (domain.whoisPrivacy ? 'Yes' : 'No')  + '</service:domainprivacy>\n' +
                '                    </extension:service>\n' +
                '                </extension:create>\n' : '' }
                </request>`

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            cb(null, {})
        })
    }

    /**
     * This function locks a domain in your account
     * https://agent.tryout-eurodns.com/documentation/http/domain/lock/
     *
     * @param domain    Required   String  The domain name to lock
     */
    lock (domain, cb) {

        if (!domain || typeof domain === 'function' || domain === '') return cb(new Error('You must specify a domain name to be able to lock'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:domain="http://www.eurodns.com/domain">
                <domain:lock>
                    <domain:name>${domain}</domain:name>
                </domain:lock>
            </request>`

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            cb(null, {})
        })
    }

    /**
     * Unlock a domain
     * https://agent.tryout-eurodns.com/documentation/http/domain/unlock/
     *
     * @param domain    Required    String  The domain name to unlock
     * @param cb
     * @return {*}                  Object  Returns an empty object on success
     */
    unlock (domain, cb) {
        if (!domain || typeof domain === 'function' || domain === '') return cb(new Error('You must specify a domain name to be able to unlock it'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:domain="http://www.eurodns.com/domain">
                <domain:unlock>
                    <domain:name>${domain}</domain:name>
                </domain:unlock>
            </request>`

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            cb(null, {})
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
