# Zones

## zones.list
To get the list of domains for which you have created zones. You can optionally provide a tld string to look in a specific tld.

https://agent.api-eurodns.com/documentation/http/zone/list/

**Returns:** `[ 'appsynth.be', 'appsynth.com' ]`
```javascript
api.zones.list('be', (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

## zones.detail
The get the list of records for a zone

https://agent.api-eurodns.com/documentation/http/zone/info/

**Returns:** `{ name: 'zoneName', records: [ recordsArray ] }`
```javascript
api.zones.detail('appsynth.be', (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

## zones.update
To update a zones record. Following actions are possible: `add`, `remove`, `update`

https://agent.api-eurodns.com/documentation/http/zone/update/

**IMPORTANT::** You can only update a single record per request!!

**Returns:** _nothing_

```javascript
const zone = {
    name: 'appsynth.be',
    records: {
        action: 'remove',   // This can be add, update or remove
        id: 'id'            // The ID to remove
    }
}

const example2= {
    name: 'appsynth.be',
    records: {
        action: 'add',
        // All the rest is a recordModel object
    }
}

const example3 = {
    name: 'appsynth.be',
    records: {
        action: 'update',
        id: 'id',
        // All the rest is a recordModel object
    }
}

api.zones.update(zone, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

## zones.create
To create a new zone for one of your domains. If you use the `zone.replace` parameter, you can override a complete zone.

https://agent.api-eurodns.com/documentation/http/zone/create/

**Returns:** _nothing_

```javascript
const zone =  {
     "name": "appsynth.be",
     "replace": true,
     // Array of recordModel objects
     "records": [{
        "type": "A",
        "ttl": 600,
        "host": "api",
        "data": "10.10.10.1"
     },{
        "type": "A",
        "ttl": 600,
        "host": "@",
        "data": "10.10.10.2"
     }]
}

api.zones.zone(zone, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```

## zones.nsCheck
Check the nameservers of a zone

https://agent.api-eurodns.com/documentation/http/zone/nscheck/

**Returns:** `{ name: 'zone', check: 'success/failed', reason: '', code: '' }`

```javascript
api.zones.nsCheck('appsynth.be', (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```