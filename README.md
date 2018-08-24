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
    mode: 'development', // Can be development or production, development is the default
    //uri: '' // The URL of the API server (normally the API takes this by itself)
}

const api = new EuroDNS(credentials)
```

## Modules
All modules are based on the structure that can be found no the [EuroDNS API page](https://agent.tryout-eurodns.com/)
Every function needs a callback with the structure `(error, response)` and all the returned errors are of the `Error` type.

### Agent
The agent module

#### Balance
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

#### List
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

#### Add
Add an IP address to allow API access

**Returns:** _nothing_

```javascript 1.5
api.ip.add('10.1.0.1', (err) => {
    if (err) console.log(err)
})
```

#### Remove
Remove an IP address to disallow API access

**Returns:** _nothing_

```javascript 1.5
api.ip.remove('10.1.0.1', (err) => {
    if (err) console.log(err)
})
```

### Top level domains
Actions for the top level domains

#### List
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

### Domains
Actions for a domain

#### Check
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


### Contact Profiles
Actions for the contact profiles

#### List
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

#### Add
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

#### Remove
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

#### Detail
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

### Nameserver profiles

#### List
List all the nameserver profiles in your account


### Folders

#### List
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

#### Add
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

#### Remove
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

### Zone Profiles

#### List
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

#### Create
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


