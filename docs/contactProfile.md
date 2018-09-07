# Contact Profile
Actions for the contact profiles

## contactProfile.list
List all the available contact profiles of your account

https://agent.api-eurodns.com/documentation/http/contactprofile/list/

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

## contactProfile.create
Add a new profile to your account

https://agent.api-eurodns.com/documentation/http/contactprofile/add/

**Returns:** `{ id: 'theNewProfileId'}`

```javascript 1.5
// All commented properties are optional
// See the contactModel for more info
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

## contactProfile.remove
Remove a contact profile from your account

https://agent.api-eurodns.com/documentation/http/contactprofile/remove/

**Returns:** _nothing_

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

## contactProfile.detail
Gives the details about a specific profile

https://agent.api-eurodns.com/documentation/http/contactprofile/info/

**Returns:** `{ contactModel }`
```javascript 1.5
const profileId = 'yourProfileId'

api.contactProfile.detail(profileId, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
       
    }
})
```