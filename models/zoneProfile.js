class ZoneProfile {
    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    list(cb) {
        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zoneprofile="http://www.eurodns.com/zoneprofile">
                <zoneprofile:list/>
            </request>`

        this.request(reqData, (err, res) => {
            cb(err ? err : null, res)
        })
    }

    /**
     * Create a new zone Profile in your account
     *
     * @param zone                      Object      Required    The zone Profile to configure
     * @param zone.name                 String      Required    The name of the zone profile
     * @param zone.records              Array       Required    The array of the records to configure
     * @param   record.type             String      Required    The type of record to create (A, AAAA, MX, TXT,...)
     *          record.redirectionType  String                  Read https://agent.tryout-eurodns.com/documentation/http/zoneprofile/create/
     *          record.newUrl           String
     *          record.source           String
     *          record.destination      String
     *          record.host             String
     *          record.data             String
     *          record.ttl              Number
     *          record.mxPriority       Number
     *          record.refresh          Number
     *          record.retry            Number
     *          record.expire           Number
     *          record.minimum          Number
     *          record.serial           Number
     *          record.weight           Number
     *          record.port             Number
     * @param cb
     * @return {*}
     */
    create(zone , cb) {

        if (!zone.name) return cb(new Error('Provide a zone profile name'))
        if (!zone.records || (zone.records && zone.records.length === 0)) return cb(new Error('Provide at least one record block'))

        zone.records.forEach( record => {
            // Verify all the records
            const recordTypeList = ['SOA', 'NS', 'PTR', 'MX', 'A', 'CNAME', 'AAAA', 'TXT', 'APEX', 'CAA', 'UrlForward', 'MailForward']
            if (!record.type || recordTypeList.indexOf(record.type) === -1)
                return cb(new Error('Record type not correct! Possible values: ' + recordTypeList))
        })

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zoneprofile="http://www.eurodns.com/zoneprofile" xmlns:record="http://www.eurodns.com/record">
                <zoneprofile:create>
                    <zoneprofile:name>${zone.name}</zoneprofile:name>
                    <zoneprofile:records>
                        ${this.returnRecords(zone.records)}
                    </zoneprofile:records>
                </zoneprofile:create>
            </request>`

        console.log(reqData)
        this.request(reqData, (err, res) => {
            cb(err ? err : null, res)
        })
    }

    /**
     * Parses an array of records into the needed XML
     * @param records
     * @return {string}
     */
    returnRecords(records) {
        let recordsXML = ''

        if (records && records.length > 0) {
            records.forEach( record => {

                const recordXML =   `<zoneprofile:record>
                            <record:type>${record.type}</record:type>
                            ${record.redirectionType ? '<record:frame>' + record.redirectionType + '</record:frame>' : ''}
                            ${record.newUrl ? '<record:newurl>' + record.newUrl + '</record:newurl>' : ''}
                            ${record.source ? '<record:source>' + record.source + '</record:source>' : ''}
                            ${record.destination ? '<record:destination>' + record.destination + '</record:destination>' : ''}
                            ${record.host ? '<record:host>' + record.host + '</record:host>' : ''}
                            ${record.data ? '<record:data>' + record.data + '</record:data>' : ''}
                            ${record.ttl ? '<record:ttl>' + record.ttl + '</record:ttl>' : ''}
                            ${record.mxPriority ? '<record:mx_priority>' + record.mxPriority + '</record:mx_priority>' : ''}
                            ${record.refresh ? '<record:refresh>' + record.refresh + '</record:refresh>' : ''}
                            ${record.retry ? '<record:retry>' + record.retry + '</record:retry>' : ''}
                            ${record.expire ? '<record:expire>' + record.expire + '</record:expire>' : ''}
                            ${record.minimum ? '<record:minimum>' + record.minimum + '</record:minimum>' : ''}
                            ${record.serial ? '<record:serial>' + record.serial + '</record:serial>' : ''}
                            ${record.respPerson ? '<record:resp_person>' + record.respPerson + '</record:resp_person>' : ''}
                            ${record.weight ? '<record:weight>' + record.weight + '</record:weight>' : ''}
                            ${record.port ? '<record:port>' + record.port + '</record:port>' : ''}
                        </zoneprofile:record>`

                    recordsXML += recordXML.replace(/^\s*[\r\n]/gm, "")
            })
        }

        return recordsXML;
    }
}

module.exports = ZoneProfile