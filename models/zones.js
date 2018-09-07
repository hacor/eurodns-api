const records = require('./../helpers/records')

class Zones {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * List all the domains for which you created zones
     * https://agent.tryout-eurodns.com/documentation/http/zone/list/
     *
     * @param tld       Optional    String  The TLD for which you want to check created zones
     * @param cb
     */
    list (tld, cb) {

        if (!tld || typeof tld === 'function') {
            cb = tld;
        }

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zone="http://www.eurodns.com/zone">
                <zone:list>
                    ${tld && typeof tld !== 'function' ? '<zone:tld>' + tld + '</zone:tld>' : ''}
                </zone:list>
            </request>`

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            let result = []

            if (res.list && res.list.name) {
                // We have results!

                if (res.list.name.length > 0) {
                    // Seems we have an array of domains
                    res.list.name.forEach( zone => {
                        result.push(zone.__text)
                    })
                } else {
                    // We should have a single domain
                    result.push(res.list.name.__text)
                }

            }

            cb(null, result)
        })
    }

    /**
     * Creates a zone with records
     * https://agent.tryout-eurodns.com/documentation/http/zone/create/
     *
     * @param   zone            Required        Object      The zone object
     *          zone.name       Required        String      The name of the domain to create the zone for
     *          zone.replace    Optional        Boolean     If set to true, the API will remove an existing zone
     *          zone.records    Required        Array       An array of record objects
     * @param cb
     * @return {*}
     */
    create (zone, cb) {

        if (!zone.name) return cb(new Error('Provide a name for the zone'))
        if (!zone.records || zone.records.length === 0) return cb(new Error('At least one record must be provided'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zone="http://www.eurodns.com/zone" xmlns:record="http://www.eurodns.com/record">
                <zone:create>
                    <zone:name>${zone.name}</zone:name>
                    ${zone.replace ? '<zone:replace>' + zone.replace + '</zone:replace>' : '' }
                    <zone:records>
                        ${this.zoneRecordsXml(zone.records)}
                    </zone:records>
                </zone:create>
            </request>`

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            cb(null, {})
        })
    }

    /**
     * Update an existing zone
     *
     * @param   zone            Required    Object
     *          zone.name       Required    String      The name of the zone to update
     *          zone.records    Required    Array       An array of record objects
     *
     *          Changes to the record object::
     *          record.action   Required    String      add, update, remove
     *          record.id       R/O         String      Necessary for update and remove
     *
     *
     * @param cb
     * @return {*}
     */
    update (zone, cb) {

        if (!zone.records) return cb(new Error('You must provide a records array'))

        if (zone.records && zone.records.length > 0) {
            // Loop through the records and check
            zone.records.forEach(record => {
                if (!['add', 'update', 'remove'].indexOf(record.action) === -1) return cb(new Error('You must specify an record.action field: Allowed values are add, update or remove'))
                if (['update', 'remove'].indexOf(record.action) > -1 && (!record.id || record.id === '')) return cb(new Error('The action update and remove records requires a record.id field to specify which record to delete/update'))
            })
        }
        if (!zone.name) return cb(new Error('Provide a name for the zone to update'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zone="http://www.eurodns.com/zone" xmlns:record="http://www.eurodns.com/record">
                <zone:update>
                    <zone:name>${zone.name}</zone:name>
                    <zone:records>
                        ${this.updateRecordsXml(zone.records)}
                    </zone:records>
                </zone:update>
            </request>`

        console.log(reqData)

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            cb(null, {})
        })
    }

    /**
     * Get the info of a zone
     * https://agent.tryout-eurodns.com/documentation/http/zone/info/
     *
     * @param zone          Required    String      THe zone to get the info for
     * @param cb
     */
    detail (zone, cb) {

        if (!zone || zone === '' || typeof zone === 'function') return cb(new Error('You must provide a zone to get the info for'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zone="http://www.eurodns.com/zone">
                <zone:info>
                    <zone:name>${zone}</zone:name>
                </zone:info>
            </request>`

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            const result = {
                name: res.name.__text,
                records: records.recordsToJson(res.records.record)
            }

            cb(null, result)
        })
    }


    /**
     * Check the nameservers for the specified zone
     *
     * @param zone      Required        String      The zone to check
     * @param cb
     * @returns {*}                     Object      { name: 'zone', check: 'success/failed', reason: '', code: '' }
     */
    nsCheck (zone, cb) {
        if (!zone || typeof zone === 'function') return cb(new Error('You must specify a zone to check'))

        const reqData = `<?xml version="1.0" encoding="UTF-8"?>
                        <request xmlns:zone="http://www.eurodns.com/zone">
                            <zone:nscheck>
                                <zone:name>${zone}</zone:name>
                            </zone:nscheck>
                        </request>`

        this.request(reqData, (err, res) => {
            if (err) return cb(err)

            const result = {}

            if (res.check && res.check.cd && res.check.cd.name) {
                result.name = res.check.cd.name.__text
                result.check = res.check.cd.name._check
                result.reason = res.check.cd.reason.__text
                result.code = res.check.cd.reason._code
            }

            cb(null, result)
        })
    }


    zoneRecordsXml (zoneRecords) {
        let xml = ''
        zoneRecords.forEach(record => {
            xml += `<zone:record>
                        ${records.recordToXml(record)}
                    </zone:record>`
        })

        return xml
    }


    /**
     * This function returns the XML to add, update or delete records for a zone
     *
     * @param zoneRecords
     * @return {string}
     */
    updateRecordsXml (zoneRecords) {

        let xml = ''

        // Check whether it is an array
        if (zoneRecords && zoneRecords.action) zoneRecords = [ zoneRecords ]

        if (zoneRecords && zoneRecords.length > 0) {
            // Loop through the record array
            zoneRecords.forEach( record => {
                switch(record.action) {
                    case 'add':
                        xml +=
                            `<zone:add>
                                <zone:record>
                                    ${records.recordToXml(record)}
                                </zone:record>
                            </zone:add>`
                        break;
                    case 'update':
                        xml +=
                            `<zone:change>
                                <zone:record id="${record.id}">
                                    ${records.recordToXml(record)}
                                </zone:record>
                            </zone:change>`
                        break;
                    case 'remove':
                        xml +=
                            `<zone:remove>
                                <zone:record id="${record.id}"/>
                            </zone:remove>`
                        break;
                }
            })
        }

        return xml;
    }

}

module.exports = Zones;
