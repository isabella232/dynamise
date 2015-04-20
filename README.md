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
####client.delete("tableName")
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
####client.table("tableName").upsert(item)

Creates a new item, or replaces an old item with a new item. If an item that has the same primary key as the new item already exists in the specified table, the new item completely replaces the existing item.

####client.table("tableName").multiUpsert(client,items)
####client.table("tableName").upload(Array|ReadableStream)

Uploading using an UploadStream. Returns a Promise which handles the events internally.

```javascript
.upload([]).then(...)
.upload(downloadStream).then(...)
```

Call without an argument to get the WritableStream instance for custom piping

```javascript
downloadStream.pipe(client.table("test").upload())
```

####client.table("tableName").download(writableStream)
####client.table("tableName").delete(hash,range)
####client.table("tableName").find(params)
####client.table("tableName").findAll(params)
####client.table("tableName").query(params)
####client.table("tableName").scan(params)
####client.table("tableName").scanAll(params)
