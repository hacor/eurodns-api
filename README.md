# A NPM module for the EuroDNS API

## Installation & usage

Run the following command to install EuroDNS API npm module

```
npm i --save eurodns-api
```

Use the module in the following way

```javascript 1.5
const EuroDNS = require('eurodns-api')

const credentials = {
    user: 'YourUserName',
    password: 'Your password',
    mode: 'development' // Can be development or production, development is the default
    //uri: '' // The URL of the API server (normally the API takes this by itself)
}

const api = new EuroDNS(credentials)
```

## Functions yet implemented

### Agent
- [agent.balance](#agentbalance)
### IP
-  [ip.list](#iplist)
- [ip.add](#ipadd)
- [ip.remove](#ipremove)
### Top level domains
- [tld.list](#tldlist)
- [tld.detail](#tlddetail)
### Domain
- [domain.check](#domaincheck)
- [domain.create](#domaincreate)
- [domain.renew](#domainrenew)
- [domain.setRenewalMode](#domainsetrenewalmode)
- [domain.list](#domainlist)
- [domain.info](#domaininfo)
- [domain.update](#domainupdate)
- [domain.lock](#domainlock)
- [domain.unlock](#domainunlock)
### Contact profile
- [contactProfile.list](#contactprofilelist)
- [contactProfile.create](#contactprofilecreate)
- [contactProfile.remove](#contactprofileremove)
- [contactProfile.detail](#contactprofiledetail)
### Nameserver Profile
*Only works in production mode*
- [nameserverProfile.list](#nameserverprofilelist)
### Folder
- [folder.list](#folderlist)
- [folder.add](#folderadd)
- [folder.remove](#folderremove)
### Zone profile
*Only works in production mode*
- [zoneProfile.list](#zoneprofilelist)
- [zoneProfile.create](#zoneprofilecreate)

### Zones


## Modules
All modules are based on the structure that can be found no the [EuroDNS API page](https://agent.tryout-eurodns.com/)
Every function needs a callback with the structure `(error, response)` and all the returned errors are of the `Error` type.

### Agent
The agent module

#### agent.balance
Get the balance of your account.

**Returns:** { currency: "EUR", amount: Number }

```javascript 1.5
api.agent.balance((err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

### IP
The IP module

#### ip.list
Lists all the allowed IPs in your account

**Returns:** `['ip1', 'ip2']`

```javascript 1.5
api.ip.list((err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

#### ip.add
Add an IP address to allow API access

**Returns:** _nothing_

```javascript 1.5
api.ip.add('10.1.0.1', (err) => {
    if (err) console.log(err)
})
```

#### ip.remove
Remove an IP address to disallow API access

**Returns:** _nothing_

```javascript 1.5
api.ip.remove('10.1.0.1', (err) => {
    if (err) console.log(err)
})
```

### Top level domains
Actions for the top level domains

#### tld.list
List all top level domains. Returns an array of all available top level domains

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

#### tld.detail
Receive the details about a specific TLD

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

### Domain
Actions for a domain

#### domain.check
Check if a domain name is available. You can use a string or an array to check multiple domains at once. This function always returns an array.

**Returns:** `[{ available: Boolean, domain: Domainname}]`

```javascript 1.5
api.domain.check('example.com', (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

#### domain.create
Register a domain using the EuroDNS API: https://agent.api-eurodns.com/documentation/http/domain/create/information.php

**Returns** `{ domain: String, roId: String }`
```javascript
const domain = {
    name: 'appsynth6.be',
    subscriptionPeriod: 0,
    renewalPeriod: 'autorenew',
    //folderId: 'id',
    //nameserverProfileId: 'id',
    //zoneProfileId: 'id',
    //nameservers: [   // If no nameservers array AND no nameserverProfileId, we use the default EuroDNS nameservers
    //    {
    //        priority: 0,
    //        fqdn: 'ns.example.com',
    //        ip: '10.10.10.1'
    //    }],
    contacts: [
        // All 4 types are required!
        {
            type: 'admin',
            profileId: '500565544'
            // If you don't have a profile ID, you specify the contact as explaned in contactProfile.add
        },{
            type: 'billing',
            profileId: '500565544'
        },{
            type: 'tech',
            profileId: '500565544',
        }, {
            type: 'org',
            profileId: '500565544'
        }
    ],
    //claim: { // The claim object is completely optional
    //    noticeId: 'id'
    //    key: 'key,
    //    accepted: '00111100' //accepted dat (epoch time)
    //    ip: '10.10.10.1' // Client IP address
    //},
    //whoisPrivacy: false
}

api.domain.create(domain, (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
})
```

#### domain.renew
Renew an existing domain in your account

**Returns:** _nothing_
```javascript
const domain = {
    name: 'appsynth.be',
    period: 1
}

api.domain.renew(domain, (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
})
```

#### domain.setRenewalMode
Sets the renewal mode for a domain in your account

**Returns:** _nothing_
```javascript
const domain = {
    name: 'appsynth.be',
    autorenew: true         // When this value is not provided or false, the sevrer uses 'autoexpire'
}

api.domain.setRenewalMode(domain, (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
})
``` 

#### domain.list
List all the domains in your account

**Returns:** [ 'example1.com', 'example2.com',...]

```javascript
const domain = {
    //name: '.be',
    //folderId: 'id',
    //status: 'registered' OR 'quarantined'
}

api.domain.list(domain, (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
})
```

#### domain.info
Outputs the info of a specific domain

**Returns:** `{ domainInfoObject }`
```javascript
api.domain.info('appsynth.be', (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
    
    /**
    * Should show something like:
    * {
          "domain": "appsynth6.be",
          "roId": "D513320529-BE",
          "status": {
              "code": "1000",
              "text": "Registered"
          },
          "renewal": "autoRenew",
          "contact": [
              {
                  "type": "org",
                  "id": "CDO513308184"
              },
              {
                  "type": "billing",
                  "id": "CDB513308184"
              },
              {
                  "type": "tech",
                  "id": "CDT513308184"
              },
              {
                  "type": "admin",
                  "id": "CDA513308184"
              }
          ],
          "pending": "no",
          "created": "2018-09-05T00:00:00.000Z",
          "updated": "2018-09-05T00:00:00.000Z",
          "expires": "2019-09-02T00:00:00.000Z",
          "nameservers": [
              {
                  "fqdn": "ns1.eurodns.com",
                  "ip": "80.92.65.2"
              },
              {
                  "fqdn": "ns2.eurodns.com",
                  "ip": "80.92.89.242"
              },
              {
                  "fqdn": "ns3.eurodns.com",
                  "ip": "80.92.95.42"
              },
              {
                  "fqdn": "ns4.eurodns.com",
                  "ip": "192.174.68.100"
              }
          ],
          "contactValidated": false,
          "whoisPrivacy": false
      }*/
})
```

#### domain.update
Update a domain in your account. Currently the `dnssec` extension is unsupported!

**Returns:** _nothing_
```javascript

// All commented fields are optional
const domain = {
    name: 'appsynth6.be',
    //folderId: 'id',
    //nameserverProfileId: 'id',
    //zoneProfileId: 'id',
    //nameservers: [ 
    // You can not specify nameservers when nameserverProfileId exists
    //    {
    //        priority: 0,
    //        fqdn: 'ns.example.com',
    //        ip: '10.10.10.1'
    //    }],
    contacts: [
        // Only add the contacts you wish to update
        {
            type: 'admin',
            //profileId: 'id'
            // If you don't have a profile ID, you specify the contact as explaned in contactProfile.add
        }
    ],
    //whoisPrivacy: false
}

api.domain.update(domain, (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
})
```

#### domain.lock
Lock a domain in your account
**Returns:** _nothing_
````javascript
api.domain.lock('appsynth.be', (err, res) => {
    if (err) console.log(err.message)

    // The result should be an empty object {}
    console.log(res)
})
````

#### domain.unlock
Unlock a domain in your account
**Returns:** _nothing_
````javascript
api.domain.unlock('appsynth.be', (err, res) => {
    if (err) console.log(err.message)

    // The result should be an empty object {}
    console.log(res)
})
````

###Zones
All the functions in the zone object

#### zones.list
List all the domains for which you created zones. You can provide a tld or provide an empty string to check for all tlds.

**Returns:** `[ 'appsynth.be', 'appsynth1.be' ]`
```javascript 1.5
api.zones.list('.be', (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

### Contact Profile
Actions for the contact profiles

#### contactProfile.list
List all the available contact profiles of your account

**Returns:** `[{ name: 'profileName', id: 'profileID', type: 'profileType' }]`

```javascript 1.5
api.contactProfile.list((err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

#### contactProfile.create
Add a new profile to your account

**Returns:** `{ id: 'theNewProfileId'}`

```javascript 1.5
// All commented properties are optional
const profile= {
    name: 'AppSynth',
    firstName: 'Hans',
    lastName: 'Cornelis',
    //company: 'AppSynth',
    addressLine1: 'Koekoekstraat 70',
    //addressLine2: 'Second address line'
    //addressLine3: 'Third address line',
    city: 'Melle',
    postalCode: 2200,
    countryCode: 'BE',
    email: 'info@appsynth.io',
    phone: "+999999999",
    //fax: "+99999999"
}

api.contactProfile.add(profile, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

#### contactProfile.remove
Remove a contact profile from your account

```javascript 1.5
const profileId = 'yourProfileId'

api.contactProfile.remove(profileId, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('successful removed contact profile id ' + profileId)
    }
})
```

#### contactProfile.detail
Gives the details about a specific profile

**Returns:** `{ profileObject }`
```javascript 1.5
const profileId = 'yourProfileId'

api.contactProfile.detail(profileId, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
        
        /**
        * Should log something like: 
        * 
        * All commented properties are optional
          const profile= {
              name: 'AppSynth',
              firstName: 'Hans',
              lastName: 'Cornelis',
              //company: 'AppSynth',
              street: 'Koekoekstraat 70',
              city: 'Melle',
              postalCode: 2200,
              countryCode: 'BE',
              email: 'info@appsynth.io',
              phone: "+999999999",
              //fax: "+99999999"
          }
          */
    }
})
```

### Nameserver profile

#### nameserverProfile.list
List all the nameserver profiles in your account


### Folder

#### folder.list
Lists all the folders in your account

**Returns:** `[{name: 'foldername', id: 'folderId', subFolders: [Array of subfolders]]`
```javascript 1.5
this.folder.list( (err, res) => {
    if (err) {
        console.log(err.message)
    } else {
        console.log(JSON.stringify(res))
    }
})
```

#### folder.add
Add a new folder to your API account

**Returns:** `{ id: 'folderId' }`
```javascript 1.5
const params = {
    name: 'newFolder',
    parentId: 98 // This field is only needed for subfolders
}

api.folder.add(params, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

#### folder.remove
Removes a folder from your API account

**Returns:** _nothing_
```javascript 1.5
const folderId = '101'

api.folder.remove(folderId, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Successfully removed folder with id ' + folderId)
    }
})
```

### Zone Profile

#### zoneProfile.list
List all the available zone profiles in your account

TODO:: returns...

```javascript 1.5
api.zoneProfile.list((err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

#### zoneProfile.create
Create a new zone profile.
Read https://agent.tryout-eurodns.com/documentation/http/zoneprofile/create/ to find out what all the fields mean and when they are needed

```javascript 1.5
// This just shows all available fields
const zone = {
    name: 'someZone',
    records: [
        {
            type: 'A',
            redirectionType: '',
            newUrl: '',
            source: '',
            destination: '',
            host: '',
            data: '',
            ttl: 60,
            mxPriority: 10,
            refresh: 60,
            retry: 60,
            expire: 600,
            minimum: 60,
            serial: 60,
            weight: 60,
            port: 80
        }
    ]
}
api.zoneProfile.create(zone, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```


