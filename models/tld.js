class TLD {

    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * List all active top level domains
     *
     * https://agent.api-eurodns.com/documentation/http/tld/list/
     *
     * @return  Array   An array of TLDs
     */
    list (cb) {
        const reqData =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<request xmlns:policy="http://www.eurodns.com/policy">\n' +
            '    <tld:list/>\n' +
            '</request>'

        this.request(reqData, (err, res) => {
            cb(err ? err.code : null, this.tldListParser(res));
        })
    }

    /**
     * This function parses the XML array answered by the server into a javascript array of tlds
     *
     * https://agent.api-eurodns.com/documentation/http/ip/add/
     *
     * @param xml
     */
    tldListParser(json) {
        const tlds = [];

        if (json && json.list && json.list.name && json.list.name.length > 0) {
            json.list.name.forEach(tld => {
                tlds.push(tld.__text);
            })
        }

        return tlds

    }

    /**
     * Get the details about a specific TLD
     *
     * @param tld       Required    String      The TLD to look up
     * @param cb
     * @return {*}                  Object      Returns a TLD detail object. Example:
      {
          name: 'BEER',
          category: 'NGTLD',
          minSubPeriod: 1,
          incSubPeriod: 1,
          maxSubPeriod: 10,
          minRenPeriod: 1,
          incRenPeriod: 1,
          maxRenPeriod: 9,
          dayRenBeforeExpiration: 5,
          minCharAllowed: 3,
          maxCharAllowed: 63,
          hyphenAllowed: true,
          numberAllowed: true,
          localOCRequired: false,
          localACRequired: false,
          localTCRequired: false,
          localBCRequired: false,
          setupFee: 'N/A',
          annualFee: 24,
          modificationFee: 0,
          tradeEnabled: false,
          transferEnabled: true,
          transferOutEnabled: true,
          updateEnabled: true,
          updateOContactAllowed: true,
          updateAContactAllowed: true,
          updateTContactAllowed: true,
          updateBContactAllowed: true,
          updateLicenseeNeedTrade: false,
          tradeFee: 'N/A',
          tradeRequired: false,
          tradeRequiredForFields: 'NONE',
          transferFee: 24,
          transferAddYear: false,
          transferNeedAuthCode: true,
          transferTradeEnabled: false,
          restricted: false,
          lockingEnabled: true,
          dnsSec: false,
          idn: true,
          needAdditionalInfoNew: true,
          needAdditionalInfoUpdate: false,
          needAdditionalInfoTransfer: false,
          needAdditionalInfoTrade: false,
          needAdditionalInfoSunrise: true,
          transferNeedSignedDoc: false,
          updateNsAllowed: true,
          renewalMethod: 'AUTORENEW',
          renewalFee: 24,
          needContactValidation: true,
          reactivateEnabled: true,
          reactivateFee: 0,
          claims: false
      }*/
    detail(tld, cb) {

        // Check id param
        if (!tld || typeof tld === 'function') return cb(new Error('Provide a correct TLD'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:tld="http://www.eurodns.com/tld">
                <tld:info>
                    <tld:name>${tld}</tld:name>
                </tld:info>
            </request>`

        this.request(reqData, (err, res) => {

            const tldDetail = {}

            for (var property in res) {
                if (res.hasOwnProperty(property)) {
                    if (res[property].__text) {
                        if (res[property].__text === 'YES') {
                            // replace yes with true
                            tldDetail[property] = true
                        } else if (res[property].__text === 'NO') {
                            // Replace no with false
                            tldDetail[property] = false
                        } else if (parseFloat(res[property].__text)) {
                            // Make numbers from the numbers
                            tldDetail[property] = parseFloat(res[property].__text)
                        } else if (res[property].__text === '0.00') {
                            // Manually replaces zeros because parseFloat doesn't do this
                            tldDetail[property] = 0
                        } else {
                            tldDetail[property] = res[property].__text
                        }
                    }
                }
            }

            cb(err ? err.code : null, tldDetail);
        })
    }
}

module.exports = TLD;
