#DB
##Examples
Look into example folder to learn about the available functions

##Cheat-Sheet
All the following examples assume that you got a client for a specific endpoint, like so:
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
####client.multiUpsert(tables)

Does an multiUpsert on the tables specified in the tables object. The param `tables` should look like
```javascript
var tables = {
  "TableA": [item1, item2, ...],
  "TableB": [item1, item2, ...]
}

client.multiUpsert(tables).then(...)
```

####client.multiRead(params)
###Table functions
####client.table("tableName").read(hash,range)
####client.table("tableName").patch(item)

Use to update an existing item.

####client.table("tableName").upsert(item)
####client.table("tableName").multiUpsert(items)

Uses the *batchWriteItem* method from AWS.DynamoDB to do an upsert on many items. Note that *batchWriteItem*
cannot update items. Items which already exist are fully replaced.

```javascript
var items = [
  { UserId: "1", FileId: "file#1" },
  { UserId: "2", FileId" "file#2" }, // up to 25 items
  ...
]

client.table("Example").multiUpsert(items).then(...);
```

**NOTE:** If you want to multiUpsert on different tables use the client.multiUpsert() method. Actually,
this method is using it either.


####client.table("tableName").upload(Array)

Upload an array of items using multiUpsert. Returns a Promise which handles the events internally.

```javascript
var items = [
  { UserId: "1", FileId: "file#1" },
  { UserId: "2", FileId" "file#2" },
  ...
];

client.table("Example").upload(items).then(...);
```

**NOTE:** Currently this is only an alias for client.table(tableName).multiUpsert()

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
