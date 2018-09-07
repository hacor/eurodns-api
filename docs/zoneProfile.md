# Zone Profile

## zoneProfile.list
List all the available zone profiles in your account

https://agent.api-eurodns.com/documentation/http/zoneprofile/list/

**Returns:** [{ id: 'id': name: 'profileName' } ]

```javascript 1.5
api.zoneProfile.list((err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

## zoneProfile.create
Create a new zone profile.

https://agent.api-eurodns.com/documentation/http/zoneprofile/create/

**Returns:** _nothing_
```javascript 1.5
// This just shows all available fields
const zone = {
    name: 'someZone',
    records: [
        // List of recordModels
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
## zoneProfile.info
Shows the info of a specific profile

https://agent.api-eurodns.com/documentation/http/contactprofile/info/

**Returns:** `{ name: "profileName", records: [ Array of record objects ] }`
```javascript
api.zoneProfile.info('id', (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

## zoneProfile.remove
Removes a specified zoneProfile

https://agent.api-eurodns.com/documentation/http/zoneprofile/remove/

**Returns:** _nothing_
```javascript
api.zoneProfile.remove('id', (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```