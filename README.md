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

**IMPORTANT:** Make sure you add the IP address of your machine to the API list first! Otherwise it won't work.


## Functions yet implemented
All modules are based on the structure that can be found no the [EuroDNS API page](https://agent.tryout-eurodns.com/)
Every function needs a callback with the structure `(error, response)` and all the returned errors are of the `Error` type.

### Agent
[View file](docs/agent.md)
- [agent.balance](docs/agent.md#agentbalance)
### IP
[View file](docs/ip.md)
- [ip.list](docs/ip.md#iplist)
- [ip.add](docs/ip.md#ipadd)
- [ip.remove](docs/ip.md#ipremove)
### Top level domains
[View file](docs/tld.md)
- [tld.list](docs/tld.md#tldlist)
- [tld.detail](docs/tld.md#tlddetail)
### Domain
[View file](docs/domain.md)
- [domain.check](docs/domain.md#domaincheck)
- [domain.create](docs/domain.md#domaincreate)
- [domain.renew](docs/domain.md#domainrenew)
- [domain.setRenewalMode](docs/domain.md#domainsetrenewalmode)
- [domain.list](docs/domain.md#domainlist)
- [domain.info](docs/domain.md#domaininfo)
- [domain.update](docs/domain.md#domainupdate)
- [domain.lock](docs/domain.md#domainlock)
- [domain.unlock](docs/domain.md#domainunlock)
### Contact profile
[View file](docs/contactProfile.md)
- [contactProfile.list](docs/contactProfile.md#contactprofilelist)
- [contactProfile.create](docs/contactProfile.md#contactprofilecreate)
- [contactProfile.remove](docs/contactProfile.md#contactprofileremove)
- [contactProfile.detail](docs/contactProfile.md#contactprofiledetail)
### Nameserver Profile
[View file](docs/nameserverProfile.md)
*Only works in production mode*
- [nameserverProfile.list](docs/nameserverProfile.md#nameserverprofilelist)
### Folder
[View file](docs/folder.md)
- [folder.list](docs/folder.md#folderlist)
- [folder.add](docs/folder.md#folderadd)
- [folder.remove](docs/folder.md#folderremove)
### Zone profile
[View file](docs/zoneProfile.md)
*Only works in production mode*
- [zoneProfile.list](docs/zoneProfile.md#zoneprofilelist)
- [zoneProfile.create](docs/zoneProfile.md#zoneprofilecreate)
- [zoneProfile.info](docs/zoneProfile.md#zoneprofileinfo)
- [zoneProfile.remove](docs/zoneProfile.md#zoneprofileremove)
### Zones
[View file](docs/zones.md)
- [zones.list](docs/zones.md#zoneslist)
- [zones.detail](docs/zones.md#zonesdetail)
- [zones.create](docs/zones.md#zonescreate)
- [zones.update](docs/zones.md#zonesupdate)
- [zones.nsCheck](docs/zones.md#zonesnscheck)
