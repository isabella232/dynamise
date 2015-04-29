#DB
##Examples
Look into example folder to learn about the available functions

##Cheat-Sheet
Get client for endpoint
```javascript
var db = require("epha-model");
var client = db("local");
```
###Database functions
####client.listTables(params)
####client.create("tableName")
####client.read("tableName")
####client.remove("tableName")
####client.status("tableName")
Returns data object
```javascript
{
  TableSizeBytes: 240,
  TableStatus: "ACTIVE",
  ItemCount: 20,
  Upgradable: true
}
```
####client.active("tableName")
Return if the tableName is active
####client.recreate("tableName")
Recreates the table if exists or creates the table if not and waits until active.
####client.multiWrite(params)
####client.multiRead(params)
###Table functions
####client.table("tableName").read(hash,range)
####client.table("tableName").patch(item)

Use to update an existing item.

####client.table("tableName").upsert(item)
####client.table("tableName").multiUpsert(items)

Uses the *batchWriteItem* method from AWS.DynamoDB to do an upsert on many items. Note that *batchWriteItem*
cannot update items. Items which already exist are fully replaced.

####client.table("tableName").upload(Array)

Upload an array of items using multiUpsert. Returns a Promise which handles the events internally.

####client.table("tableName").createUploadStream()

Returns an instance of UploadStream to handle an upload via stream manually.

####client.table("tableName").download()

Uses scanAll to do an complete scan.

####client.table("tableName").createDownloadStream()

Returns an instance of `DownloadStream`.

####client.table("tableName").remove(hash,range)
####client.table("tableName").find(params)
####client.table("tableName").findAll(params)
####client.table("tableName").query(params)
####client.table("tableName").scan(params)
####client.table("tableName").scanAll(params)
