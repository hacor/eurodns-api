# Agent
The agent module

## agent.balance
Get the balance of your account.
https://agent.api-eurodns.com/documentation/http/agent/balance/

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
