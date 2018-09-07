const record = require('./../helpers/records')

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

            if (err) return cb(err)

            let profiles = []

            if (res.list && res.list.name && res.list.name._id) {
                // The list seems to be a single object
                profiles.push({
                    name: res.list.name.__text,
                    id: res.list.name._id
                })
            } else {
                // The list seems to be an array
                if (res.list && res.list.name && res.list.name.length > 0) {
                    res.list.name.forEach( profile => {
                        profiles.push({
                            name: profile.__text,
                            id: profile._id
                        })
                    })
                }
            }
            cb(null, profiles)
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

            if (err) return cb(err)

            cb(null, {})
        })
    }

    /**
     * Spits out the info about a zoneProfile
     * https://agent.api-eurodns.com/documentation/http/zoneprofile/info/
     *
     * @param id            Required        String      The ID to look up
     * @param cb
     * @returns {*}                         Object      A zoneProfile object
     */
    info (id, cb) {
        if (!id || typeof id === 'function') return cb(new Error('You must provide an ID to get zoneProfile info'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zoneprofile="http://www.eurodns.com/zoneprofile">
                <zoneprofile:info>
                    <zoneprofile:id>${id}</zoneprofile:id>
                </zoneprofile:info>
            </request>`

        this.request(reqData, (err, res) => {

            if (err) return cb(err)

            const profile = {
                name: res.__text,
                records: record.recordsToJson(res.records.record)
            }

            cb(null, profile)
        })
    }

    /**
     * Deletes a zoneProfile
     * https://agent.api-eurodns.com/documentation/http/zoneprofile/remove/
     *
     * @param id        Required        String      The ID of the profile to be removed
     * @param cb
     * @returns {*}                     Object      Empty object
     */
    remove (id, cb) {
        if (!id || typeof id === 'function') return cb(new Error('You must provide an ID to delete a zoneProfile'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:zoneprofile="http://www.eurodns.com/zoneprofile">
                <zoneprofile:remove>
                    <zoneprofile:id>${id}</zoneprofile:id>
                </zoneprofile:remove>
            </request>`

        this.request(reqData, (err, res) => {

            if (err) return cb(err)

            cb(null, {})
        })
    }

    update (zoneProfile, cb) {
        if (!zoneProfile.name) return cb(new Error('You must specify the name of the zoneProfile to update'))

    }

    /**
     * Parses an array of records into the needed XML
     * @param records
     * @return {string}
     */
    returnRecords(records) {
        let recordsXML = ''

        if (records && records.length > 0) {
            records.forEach( rc => {

                const recordXML =   `<zoneprofile:record>${record.recordToXml(rc)}</zoneprofile:record>`
                recordsXML += recordXML.replace(/^\s*[\r\n]/gm, "")
            })
        }

        return recordsXML;
    }
}

module.exports = ZoneProfile