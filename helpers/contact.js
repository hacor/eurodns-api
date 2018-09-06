/**
 * The default contact structure:
 *
 * @param contact               Object      Required        The contact
 * @param contact.name          String      Required        The contact name
 * @param contact.type          String      Optional        Sometimes the contact type is a required field
 * @param contact.profileId     String      Optional        Sometimes you can provide a profileId, in this case all the further contact fields will be ignored
 * @param contact.firstName     String      Required        The contact owner first name
 * @param contact.lastName      String      Required        The contact owner last name
 * @param contact.company       String      Optional        The contact owner company name
 * @param contact.addressLine1  String      Required        The contact owner address line 1
 * @param contact.addressLine2  String      Optional        The contact owner address line 2
 * @param contact.addressLine3  String      Optional        The contact owner address line 3
 * @param contact.city          String      Required        The contact owner city name
 * @param contact.postalCode    String      Required        The contact owner city postal/zip code
 * @param contact.countryCode   String      Required        The contact owner country code
 * @param contact.email         String      Required        The contact owner email
 * @param contact.phone         String      Required        The contact owner phone number. Phone number format: +999999999
 * @param contact.fax           String      Optional        The contact owner fax number. Fax number format: +999999999
 */

/**
 * Returns an xml object of a contact
 *
 * @param contact a contact object
 */
module.exports.contactToXML = function (contact) {

    if (contact.profileId && contact.profileId !== '') {
        return `<contact:type>${contact.type}</contact:type>
                <contact:contactprofileid>${contact.profileId}</contact:contactprofileid>`
    }

    return `<contact:firstname>${contact.firstName ? contact.firstName : ''}</contact:firstname>
            ${contact.type ? '<contact:type>' + contact.type + '</contact:type>' : ''}
            <contact:lastname>${contact.lastName ? contact.lastName : ''}</contact:lastname>
            ${contact.company ? '<contact:company>' + contact.company + '</contact:company>' : '' }
            <contact:address1>${contact.addressLine1 ? contact.addressLine1 : ''}</contact:address1>
            ${contact.addressLine2 ? '<contact:address2>' +  contact.addressLine2 + '</contact:address2>': ''}
            ${contact.addressLine3 ? '<contact:address3>' +  contact.addressLine3 + '</contact:address3>' : ''}
            <contact:city>${contact.city ? contact.city : ''}</contact:city>
            <contact:zipcode>${contact.postalCode ? contact.postalCode : ''}</contact:zipcode>
            <contact:country_code>${contact.countryCode ? contact.countryCode : ''}</contact:country_code>
            <contact:email>${contact.email ? contact.email : ''}</contact:email>
            <contact:phone>${contact.phone ? contact.phone : ''}</contact:phone>
            ${contact.fax ? '<contact:fax>' +  contact.fax + '</contact:fax>' : ''}`
}

/**
 * This function converts an xml2js object to a correct contact object
 *
 * @param contact       Required    Object      An xml2js contact object
 * @returns {{name: *, firstName: *, lastName: *, phone: *, street: *, city: *, postalCode: *, countryCode: *}}
 */
module.exports.contactToJson = function (contact) {
    let contactInfo = {
        firstName: contact.postalInfo.firstname.__text,
        lastName: contact.postalInfo.lastname.__text,
        phone: contact.postalInfo.voice.__text,
        street: contact.postalInfo.addr.street.__text,
        city: contact.postalInfo.addr.city.__text,
        postalCode: contact.postalInfo.addr.pc.__text,
        countryCode: contact.postalInfo.addr.cc.__text
    }

    if (contact.name && contact.name.__text)
        contactInfo.name = contact.name.__text

    if (contact.postalInfo.org && contact.postalInfo.org.__text)
        contactInfo.company = contact.postalInfo.org.__text

    if (contact.postalInfo.fax && contact.postalInfo.fax.__text)
        contactInfo.fax = contact.postalInfo.fax.__text

    return contactInfo
}

/**
 * Function to create the contact:create XML block
 *
 * @param contacts
 */
module.exports.create = function (contacts) {

    let xml = '<contact:create>'

    if (contacts && contacts.length > 0) {
        contacts.forEach( contact => {
            xml += contactToXML(contact)
        })
    }

    xml += '</contacts:create>'

    return xml
}

/**
 * Function to parse the xmlJs object to a transparent contact object.
 *
 * contact.type
 * contact.id
 *
 * @param contacts      Required    Array   The xml2js array of a contact list
 * @returns {Array}
 */
module.exports.parseContactIds = function (contacts) {

    let contactJson = []

    if (contacts && contacts.length > 0) {
        contacts.forEach( contact => {
            contactJson.push({
                type: contact._type,
                id: contact.__text
            })
        })
    }

    return contactJson
}