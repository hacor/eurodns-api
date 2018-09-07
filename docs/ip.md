# IP
The IP module

## ip.list
Lists all the allowed IPs in your account

https://agent.api-eurodns.com/documentation/http/ip/list/

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

## ip.add
Add an IP address to allow API access

https://agent.api-eurodns.com/documentation/http/ip/add/

**Returns:** _nothing_

```javascript 1.5
api.ip.add('10.1.0.1', (err) => {
    if (err) console.log(err)
})
```

## ip.remove
Remove an IP address to disallow API access

https://agent.api-eurodns.com/documentation/http/ip/remove/

**Returns:** _nothing_

```javascript 1.5
api.ip.remove('10.1.0.1', (err) => {
    if (err) console.log(err)
})
```
