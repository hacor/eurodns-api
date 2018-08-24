# A NPM module for the EuroDNS API

## Installation & usage

Run the follwing command to install EuroDNS API npm module

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

```javascript 1.6
api.agent.balance((err, res) => {
    if (err) console.log(err)
    
    console.log(res)
})
```

### IP
The IP module

#### List
Lists all the allowed IPs in your account

**Returns:** ['ip1', 'ip2']

```javascript 1.6
api.ip.list((err, res) => {
    if (err) console.log(err)
    
    console.log(res)
})
```

#### Add
Add an IP address to allow API access

