#DB
##Examples
Look into example folder to learn about the available functions

##Cheat-Sheet
All the following examples assume that you got a client for a specific endpoint, like so:
```javascript
var db = require("epha-model");
var client = db("local");
```

Most of the methods, unless stated otherwise, return native ES6 Promises. See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for details.

###Database functions
####client.listTables(params)

You will get an array with all the table names associated with the endpoint.

See [DynamoDB.listTables](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html) for more information.

####client.create("tableName")

Adds a new table.

See [DynamoDB.createTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html) for more information.

####client.read("tableName")

You will get certain information about the table specified.

See [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html) for more information.

> Returns information about the table, including the current status of the table, when it was created,
the primary key schema, and any indexes on the table.
 

####client.remove("tableName")

Deletes the table and all of its items.

See [DynamoDB.deleteTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteTable.html) for mor information.

####client.status("tableName")

This function uses `client.read(tableName)` but only fetches the following information:

- TableSizeBytes (total size in bytes)
- TableStatus (CREATING, DELETING, UPDATING, ACTIVE) 
- ItemCount (number of items)

and if the table is *upgradable* (true|false).

####client.active("tableName")

Checks if the table state is `ACTIVE` and returns an object with table data. If the table is not active
it waits for the table to become active.

Uses `client.read(tableName)` and therefore [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html).

####client.recreate("tableName")

Recreates the table if exists or creates the table if not and waits until active.

####client.multiUpsert(tables)

Does an multiUpsert on the tables specified in the tables object. The param `tables` should look like

```javascript
var tables = {
  "TableA": [item1, item2, ...],
  "TableB": [item1, item2, ...]
}
```

See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.

####client.multiRead(params)

See [DynamoDB.batchGetItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) for more information.

###Table functions

The following functions have to be appended on `client.table(tableName)`. Thus you are performing
on a specific table.

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

Returns an instance of `UploadStream` to handle an upload via stream manually.

####client.table("tableName").download()

Uses `scanAll()` to do an complete scan.

####client.table("tableName").createDownloadStream()

Returns an instance of `DownloadStream` to handle a download manually.

####client.table("tableName").remove(hash,range)
####client.table("tableName").find(params)
####client.table("tableName").findAll(params)
####client.table("tableName").query(params)
####client.table("tableName").scan(params)
####client.table("tableName").scanAll(params)
