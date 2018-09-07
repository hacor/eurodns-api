# Top level domains
Actions for the top level domains

## tld.list
List all top level domains. Returns an array of all available top level domains

https://agent.api-eurodns.com/documentation/http/tld/list/

**Returns:** `["com", "org", "net"]`

```javascript 1.5
api.tld.list((err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

## tld.detail
Receive the details about a specific 

https://agent.api-eurodns.com/documentation/http/tld/info/

**Returns:** { tldDetailObject } (see example)
```javascript 1.5
const tld = 'beer'
api.tld.detail(tld, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
        
/*
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
      }
 */
    }
})
```
