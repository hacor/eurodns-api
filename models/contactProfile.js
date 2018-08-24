class ContactProfile {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * List all available contact profiles in your API account
     *
     * @param cb
     * @returns Array [{ name: 'profileName', id: 'profileID', type: 'profileType' }]
     */
    list (cb) {
        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:contactprofile="http://www.eurodns.com/contactprofile">
                <contactprofile:list/>
            </request>`

        this.request(reqData, (err, res) => {

            // strange result code
            if (err) return cb(err)

            let profiles = []

            if ( res && res.list && res.list._numElements > 0) {
                // Profiles found!

                // CHeck if result is an array or an object of a single profile
                if (res.list.name && res.list.name instanceof Array) {
                    // Multiple profiles
                    res.list.name.forEach(profile => {
                        profiles.push({
                            name: profile.__text,
                            id: profile._id,
                            type: profile.__prefix
                        })
                    })
                } else {
                    // Single profile
                    profiles.push({
                        name: res.list.name.__text,
                        id: res.list.name._id,
                        type: res.list.name.__prefix
                    })
                }
            }

            cb(null, profiles)
        })
    }

    /**
     * Add a new profile to your API account
     *
     * @param profile               Object      Required        The profile info
     * @param profile.name          String      Required        The profile name
     * @param profile.firstName     String      Required        The profile owner first name
     * @param profile.lastName      String      Required        The profile owner last name
     * @param profile.company       String      Optional        The profile owner company name
     * @param profile.addressLine1  String      Required        The profile owner address line 1
     * @param profile.addressLine2  String      Optional        The profile owner address line 2
     * @param profile.addressLine3  String      Optional        The profile owner address line 3
     * @param profile.city          String      Required        The profile owner city name
     * @param profile.postalCode    String      Required        The profile owner city postal/zip code
     * @param profile.countryCode   String      Required        The profile owner country code
     * @param profile.email         String      Required        The profile owner email
     * @param profile.phone         String      Required        The profile owner phone number. Phone number format: +999999999
     * @param profile.fax           String      Optional        The profile owner fax number. Fax number format: +999999999
     * @param cb                    Function    Required        The callback function
     * @return  ID                  String                      The ID of the profile
     */
    add (profile, cb) {

        if (!profile.name) return cb(new Error('Provide a profile name'))
        if (!profile.firstName) return cb(new Error('Provide a firstName variable'))
        if (!profile.lastName) return cb(new Error('Provide a lastName variable'))
        if (!profile.addressLine1) return cb(new Error('Provide a addressLine1 variable'))
        if (!profile.postalCode) return cb(new Error('Provide a postalCode variable'))
        if (!profile.countryCode) return cb(new Error('Provide a countryCode variable'))
        if (!profile.email) return cb(new Error('Provide a email variable'))
        if (!profile.phone) return cb(new Error('Provide a phone variable'))
        if (!profile.city) return cb(new Error('Provide a city variable'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:contactprofile="http://www.eurodns.com/contactprofile">
                <contactprofile:create>
                    <contactprofile:name>${profile.name}</contactprofile:name>
                    <contactprofile:contact>
                        <contact:firstname>${profile.firstName}</contact:firstname>
                        <contact:lastname>${profile.lastName}</contact:lastname>
                        ${profile.company ? '<contact:company>' + profile.company + '</contact:company>' : '' }
                        <contact:address1>${profile.addressLine1}</contact:address1>
                        ${profile.addressLine2 ? '<contact:address2>' +  profile.addressLine2 + '</contact:address2>': ''}
                        ${profile.addressLine3 ? '<contact:address3>' +  profile.addressLine3 + '</contact:address3>' : ''}
                        <contact:city>${profile.city}</contact:city>
                        <contact:zipcode>${profile.postalCode}</contact:zipcode>
                        <contact:country_code>${profile.countryCode}</contact:country_code>
                        <contact:email>${profile.email}</contact:email>
                        <contact:phone>${profile.phone}</contact:phone>
                        ${profile.fax ? '<contact:fax>' +  profile.fax + '</contact:fax>' : ''}
                    </contactprofile:contact>
                </contactprofile:create>
            </request>`

        this.request(reqData, (err, res) => {

            // strange result code
            if (err) return cb(err)

            cb(null, { id: res.id.__text})
        })
    }

    /**
     * Remove a profile ID from your API account
     *
     * @param id        String      Required    The id to remove
     * @param cb        Function    Required    The callback function
     */
    remove (id, cb) {

        // Check id param
        if (!id || typeof id === 'function') return cb(new Error('Provide a correct profile ID'))

        const reqData=
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:contactprofile="http://www.eurodns.com/contactprofile">
                <contactprofile:remove>
                    <contactprofile:id>${id}</contactprofile:id>
                </contactprofile:remove>
            </request>`

        this.request(reqData, (err) => {
            cb(err ? err : null)
        })

    }

    /**
     * Get the details of a specific profile
     * @param id    Required    String  The ID to look up
     * @param cb
     * @return {*}              Object  Returns a profile as can be found in the add() function, only street is used here
     */
    detail (id, cb) {

        // Check id param
        if (!id || typeof id === 'function') return cb(new Error('Provide a correct profile ID'))

        const reqData=
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:contact="http://www.eurodns.com/contactprofile">
                <contactprofile:info>
                    <contactprofile:id>${id}</contactprofile:id>
                </contactprofile:info>
            </request>`

        this.request(reqData, (err, res) => {
            cb(err ? err : null, this.parseProfile(res))
        })
    }

    /**
     * Creates a profile object after the XML2JS transmission
     * @param profile
     * @return {{name: *, firstName: *, lastName: *, phone: *, street: *, city: *, postalCode: *, countryCode: *}}
     */
    parseProfile(profile) {
        let parsedProfile = {
            name: profile.name.__text,
            firstName: profile.contact.postalInfo.firstname.__text,
            lastName: profile.contact.postalInfo.lastname.__text,
            phone: profile.contact.postalInfo.voice.__text,
            street: profile.contact.postalInfo.addr.street.__text,
            city: profile.contact.postalInfo.addr.city.__text,
            postalCode: profile.contact.postalInfo.addr.pc.__text,
            countryCode: profile.contact.postalInfo.addr.cc.__text
        }

        // Parse optional values
        if (profile.contact.postalInfo.org && profile.contact.postalInfo.org.__text)
            parsedProfile.company = profile.contact.postalInfo.org.__text

        if (profile.contact.postalInfo.fax && profile.contact.postalInfo.fax.__text)
            parsedProfile.fax = profile.contact.postalInfo.fax.__text

        return parsedProfile;
    }
}

module.exports = ContactProfile;
