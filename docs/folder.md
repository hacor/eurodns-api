# Folder

## folder.list
Lists all the folders in your account

https://agent.api-eurodns.com/documentation/http/folder/list/

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

## folder.add
Add a new folder to your API account

https://agent.api-eurodns.com/documentation/http/folder/add/

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

## folder.remove
Removes a folder from your API account

https://agent.api-eurodns.com/documentation/http/folder/remove/

**Returns:** _nothing_
```javascript 1.5
const folderId = '101'

api.folder.remove(folderId, (err, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
```
