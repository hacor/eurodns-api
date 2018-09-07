# Domain
Actions for a domain

## domain.check
Check if a domain name is available. You can use a string or an array to check multiple domains at once. This function always returns an array.

https://agent.api-eurodns.com/documentation/http/domain/check/

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

## domain.create
Register a domain using the EuroDNS API. Currently only the `general template` is implemented!

https://agent.api-eurodns.com/documentation/http/domain/create/

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
            // If you don't have a profile ID, you specify the contact as a contactModel
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

## domain.renew
Renew an existing domain in your account

https://agent.api-eurodns.com/documentation/http/domain/renew/

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

## domain.setRenewalMode
Sets the renewal mode for a domain in your account

https://agent.api-eurodns.com/documentation/http/domain/setrenewalmode/

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

## domain.list
List all the domains in your account. The domain object passed to the function is optional.

https://agent.api-eurodns.com/documentation/http/domain/list/

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

## domain.info
Outputs the info of a specific domain

https://agent.api-eurodns.com/documentation/http/domain/info/

**Returns:** `{ domainInfoObject }`
```javascript
api.domain.info('appsynth.be', (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
    
    /**
    * Should show something like:
    * {
          "domain": "appsynth.be",
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

## domain.update
Update a domain in your account. Currently the `dnssec` extension is unsupported and only the `General template` is implemented.

https://agent.api-eurodns.com/documentation/http/domain/update/

*Only works in production mode!*

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
            // If you don't have a profile ID, you specify the contact as explained in contactProfile.add
        }
    ],
    //whoisPrivacy: false
}

api.domain.update(domain, (err, res) => {
    if (err) console.log(err.message)

    console.log(res)
})
```

## domain.lock
Lock a domain in your account

https://agent.api-eurodns.com/documentation/http/domain/lock/

**Returns:** _nothing_
````javascript
api.domain.lock('appsynth.be', (err, res) => {
    if (err) console.log(err.message)

    // The result should be an empty object {}
    console.log(res)
})
````

## domain.unlock
Unlock a domain in your account

https://agent.api-eurodns.com/documentation/http/domain/unlock/

**Returns:** _nothing_
````javascript
api.domain.unlock('appsynth.be', (err, res) => {
    if (err) console.log(err.message)

    // The result should be an empty object {}
    console.log(res)
})
````
