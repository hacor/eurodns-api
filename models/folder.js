class Folder {
    constructor (api) {
        this.x2js = api.x2js;
        this.config = api.config;
        this.request = api.request;
    }

    /**
     * List all the folders in your account
     *
     * @param cb
     */
    list(cb) {
        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:folder="http://www.eurodns.com/folder">
                <folder:list/>
            </request>`

        this.request(reqData, (err, res) => {

            let structure = []

            // Something went wrong
            if (err) return cb(err)

            // Parse the list of folders and subfolders
            if (res && res.list && res.list.data) {
                if (res.list.data.name) {
                    // One single folder can be found
                    structure.push(this.parseFolderdata(res.list.data))
                } else if (res.list.data instanceof Array) {
                    console.log('seems array')
                    // More folders specified
                    res.list.data.forEach( folder => {
                        structure.push(this.parseFolderdata(folder));
                    })
                }
            }

            cb(null, structure)
        })
    }

    /**
     * This function creates a loop to create the json object of the needed subfolders
     * @param folder
     * @return {{name: *, id: *, subFolders: Array}}
     */
    parseFolderdata(folder) {

        let folderStructure = {
            name: folder.name.__text,
            id: folder.id.__text,
            subFolders: []
        }

        if (folder.parentid && folder.parentid.__text) folderStructure.parentId = folder.parentid.__text;

        if (folder.subfolders && folder.subfolders.data) {
            // Look of the subfolders.data is a single object => one subdirectory
            if (folder.subfolders.data.name) {
                // One single folder can be found
                folderStructure.subFolders.push(this.parseFolderdata(folder.subfolders.data))
            } else if (folder.subfolders.data instanceof Array) {
                // More folders specified
                folder.subfolders.data.forEach(folder => {
                    folderStructure.subFolders.push(this.parseFolderdata(folder));
                })
            }
        }

        if (folderStructure.subFolders.length === 0) delete folderStructure.subFolders

        return folderStructure
    }

    /**
     * Add a new folder to your account
     *
     * @param params            Object  Required
     * @param params.name       String  Required    The name of the folder
     * @param params.parentId   String  Optional    If there is a parent folder specify its ID here
     * @param cb
     * @return {*}              Object              { id: 'FolderId' }
     */
    add(params, cb) {

        // params.name is required
        if (!params || (params && !params.name) || typeof params === 'function') return cb(new Error('At least a name property must be provided'))

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:folder="http://www.eurodns.com/folder">
                <folder:add>
                    <folder:name>${params.name}</folder:name>
                    ${params.parentId ? '<folder:parentid>' + params.parentId + '</folder:parentid>' : ''}
                </folder:add>
            </request>`

        this.request(reqData, (err, res) => {

            // Something went wrong
            if (err) return cb(err)

            cb(null, {id: res.id.__text})
        })
    }

    /**
     * Remove a folder from your API based on its ID
     * @param id        String  Required    The ID of the folder to remove
     * @param cb        Function            Callback
     * @return {*}                          Only Error is returned, if success, no result is passed
     */
    remove(id, cb) {

        if (!id || typeof id === 'function') {
            return cb(new Error('Please provide a folder id to delete'))
        }

        const reqData =
            `<?xml version="1.0" encoding="UTF-8"?>
            <request xmlns:folder="http://www.eurodns.com/folder">
                <folder:remove>
                    <folder:id>${id}</folder:id>
                </folder:remove>
            </request>`

        this.request(reqData, (err) => {
            cb(err ? err : null)
        })
    }

}

module.exports = Folder