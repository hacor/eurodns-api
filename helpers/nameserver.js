// Those are the default EuroDNS nameservers
const defaultNameservers = [
    {
        priority: 0,
        fqdn: 'ns1.eurodns.com',
        ip: '80.92.65.2'
    },{
        priority: 1,
        fqdn: 'ns2.eurodns.com',
        ip: '80.92.89.242'
    },{
        priority: 2,
        fqdn: 'ns3.eurodns.com',
        ip: '80.92.95.42'
    }, {
        priority: 3,
        fqdn: 'ns4.eurodns.com',
        ip: '192.174.68.100'
    }
]

/**
 * Returns an xml object for nameserver:update
 *
 * @param   nameservers             Required    Array   An array of nameservers
 *          nameservers.priority
 *          nameservers.fqdn
 *          nameservers.ip
 * @returns {string}
 */
module.exports.update = function (nameservers) {
    let returnData = ''

    nameservers.forEach( ns => {
        returnData +=
            `<nameserver:update>
                <nameserver:priority>${ns.priority ? ns.priority : ''}</nameserver:priority>
                <nameserver:fqdn>${ns.fqdn ? ns.fqdn : ''}</nameserver:fqdn>
                <nameserver:ipaddr>${ns.ip ? ns.ip : ''}</nameserver:ipaddr>
            </nameserver:update>`
    })

    return returnData
}

/**
 * This function returns an XML object of multiple nameserver:create fields
 *
 * @param   nameservers       Array       Required        The nameservers array
 *          nameserver.fqdn
 *          nameserver.ip
 *          nameserver.priority
 * @returns {string}
 */
module.exports.create = function (nameservers) {
    let xml = ''

    // No nameservers provided using the default ones
    if (!nameservers || nameservers.length === 0) nameservers =  defaultNameservers

    nameservers.forEach(nameserver => {
        xml +=
            `<nameserver:create>
                <nameserver:priority>${ns.priority ? ns.priority : ''}</nameserver:priority>
                <nameserver:fqdn>${ns.fqdn ? ns.fqdn : ''}</nameserver:fqdn>
                <nameserver:ipaddr>${ns.ip ? ns.ip : ''}</nameserver:ipaddr>
            </nameserver:create>`
    })


    return xml
}


/**
 * This function generates a correct JSON array of a xml2js nameserver list
 * Returns:
 *
 * nameserver.fqdn
 * nameserver.ip
 *
 * @param nameservers       Required    Array   The array returned by xml2js
 * @returns {Array}
 */
module.exports.nsToJson = function (nameservers) {
    const result = []

    if (nameservers && nameservers.length > 0) {
        nameservers.forEach( ns => {
            result.push({
                fqdn: ns.__text,
                ip: ns._addr
            })
        })
    }

    return result
}