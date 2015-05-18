#Dynamise

Dynamise wraps the native DynamoDB methods from `aws-sdk` for node.js in promisifed versions and also provides some sugar syntax to interact with your database.

**Examples:** Look into the example folder to learn about the available functions

#API Docs
All the following examples assume that you got a client for a specific endpoint, like so:
```javascript
var db = require("dynamise");
var client = db(endpoint);
```

Most of the methods, unless stated otherwise, return native ES6 Promises. See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for details.

1. Table operations
  - [client.**listTables()**](#client-listtables)
  - [client.**create()**](#client-create)
  - [client.**read()**](#client-read)
  - [client.**remove()**](#client-remove)
  - [client.**status()**](#client-status)
  - [client.**active()**](#client-active)
  - [client.**recreate()**](#client-recreate)
2. Item operations
  - [client.**multiUpsert()**](#client-multiupsert)
  - [client.**multiRead()**](#client-multiRead)
  - [client.table("tableName").**multiUpsert()**](#client-table-multiupsert)
  - [client.table("tableName").**read()**](#client-table-read)
  - [client.table("tableName").**patch()**](#client-table-patch)
  - [client.table("tableName").**upsert()**](#client-table-upsert)
  - [client.table("tableName").**upload()**](#client-table-upload)
  - [client.table("tableName").**createUploadStream()**](#client-table-createuploadstream)
  - [client.table("tableName").**download()**](#client-table-download)
  - [client.table("tableName").**createDownloadStream()](#client-table-createdownloadstream)
  - [client.table("tableName").**remove()**](#client-table-remove)
  - [client.table("tableName").**find()**](#client-table-find)
  - [client.table("tableName").**query()**](#client-table-query)
  - [client.table("tableName").**scan()**](#client-table-scan)
  - [client.table("tableName").**scanAll()**](#client-table-scanall)


##client.listTables(params) <a id="client-listtables"></a>

You will get an array with all the table names associated with the endpoint.

See [DynamoDB.listTables](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html) for more information.

##client.create("tableName") <a id="client-create"></a>

Adds a new table to the database. If you have `set(tableDefintion)` a table definition already, you can use the tableName as a String parameter. Otherwise you are able to hand over a complete table object.

**Example**
```javascript
var tableDefinition = {
    // complete table definition
}

client.create(tableDefinition).then(doMore);

// or
client.set({tableName: tableDefinition});
client.create(tableName);
```

**Note:** `create()` waits for the table to be in an `ACTIVE` state.

See [DynamoDB.createTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html) for more information.

##client.read("tableName") <a id="client-read"></a>

You will get certain information about the table specified.

See [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html) for more information.

> Returns information about the table, including the current status of the table, when it was created,
the primary key schema, and any indexes on the table.


##client.remove("tableName") <a id="client-remove"></a>

Deletes the table and all of its items.

See [DynamoDB.deleteTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteTable.html) for mor information.

##client.status("tableName") <a id="client-status"></a>

This function uses `client.read(tableName)` but only fetches the following information:

- TableSizeBytes (total size in bytes)
- TableStatus (CREATING, DELETING, UPDATING, ACTIVE)
- ItemCount (number of items)

and if the table is *upgradable* (true|false).

##client.active("tableName") <a id="client-active"></a>

Checks if the table state is `ACTIVE` and returns an object with table data. If the table is not active
it waits for the table to become active.

Uses `client.read(tableName)` and therefore [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html).

##client.recreate("tableName") <a id="client-recreate"></a>

Recreates the table if exists or creates the table if not and waits until active.

##client.multiUpsert(tables) <a id="client-multiupsert"></a>

Does an multiUpsert on the tables specified in the tables object. The param `tables` should look like

```javascript
var tables = {
  "TableA": [item1, item2, ...],
  "TableB": [item1, item2, ...]
}
```

See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.

##client.multiRead(params) <a id="client-multiread"></a>

See [DynamoDB.batchGetItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) for more information.

##client.table("tableName").read(hash,range) <a id="client-table-read"></a>

See [DynamoDB.getItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html).

##client.table("tableName").patch(item) <a id="client-table-path"></a>

Use to update an existing item.

See [DynamoDB.updateItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) for more information.

##client.table("tableName").upsert(item) <a id="client-table-upsert"></a>

See [DynamoDB.putItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) for more information.

##client.table("tableName").multiUpsert(items) <a id="client-table-multiupsert"></a>

Uses the *batchWriteItem* method from AWS.DynamoDB to do an upsert on many items. Note that *batchWriteItem*
cannot update items. Items which already exist are fully replaced.

```javascript
var items = [
  { UserId: "1", FileId: "file#1" },
  { UserId: "2", FileId" "file#2" },
  ...
]

client.table("Example").multiUpsert(items).then(...);
```

**NOTE:** If you want to multiUpsert on different tables use the client.multiUpsert() method. Actually,
this method is using it either.

See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.

##client.table("tableName").upload(items) <a id="client-table-upload"></a>

Upload an array of items using multiUpsert. Returns a Promise which handles the events internally.

```javascript
var items = [
  { UserId: "1", FileId: "file#1" },
  { UserId: "2", FileId" "file#2" },
  ...
];

client.table("Example").upload(items).then(...);
```

**NOTE:** Currently this is only an alias for client.table("tableName").multiUpsert()

##client.table("tableName").createUploadStream() <a id="client-table-createuploadstream"></a>

Returns an instance of `UploadStream` to handle an upload via stream manually.

##client.table("tableName").download() <a id="client-table-download"></a>

Actually this is an alias for `clieb.table(tableName).scanAll()` - does a complete scan.

##client.table("tableName").createDownloadStream() <a id="client-table-createdownloadstream"></a>

Returns an instance of `DownloadStream` to handle a download manually.

##client.table("tableName").remove(hash,range) <a id="client-table-remove"></a>

Deletes a single item in a table.

See [DynamoDB.deleteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) for more information.

##client.table("tableName").find(params) <a id="client-table-find"></a>

Used to find items based on conditions.

**Example**
```javascript
client.table("Example")
      .find(params) // params is optional
      .where("UserId").equals("1") // hash key
      .and("FileId").equals("2");
      .run()
```

You are able to pass a *params Object* to `find()` with attributes defined in [DynamoDB.query](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html). We build some sugar functions to make this even easier.

### - index()

The same as params would include `{ IndexName: "IndexNameValue" }`.

**Example**

```javascript
client.table("Example")
    .find()
    .index("indexName")}
    (...)
    .run();
```

### - all()

DynamoDB has several limitations related to how big a query response can be (more information about limitations can be found [here](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html)). Thus we provide a `all()` method which handles the pagination for you.

Otherwise you would have to evaluate responses `LastEvaluatedKey` attribute youself.

**Example**
```javascript
client.table("Example")
    .find()
    .all()
    (...)
    .run();
```

### - where()

This is used to define a hash key where a certain `equals()` condition is applied to.

**Example**
```javascript
client.table("Example")
  .find()
  .where("id").equals("1")
  .run();
```

**Note:** On hash keys you are only allowed to perform an `equals()` condition.

### - and()

This is used to define a range key where a certain condition is applied to.

**Example**
```javascript
client.table("Example")
  .find()
  .where("id").equals("1")
  .and("email").equals("t@epha.com")
  .run();
```

You are also allowed to apply the following conditions:
- `lt()` - lower than
- `le()` - lower than or equal
- `gt()` - greater than
- `ge()` - greater than or equal
- `between()`
- `beginsWith()`

##client.table("tableName").query(params) <a id="client-table-query"></a>

See [DynamoDB.query](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) for more information.

##client.table("tableName").scan(params) <a id="client-table-scan"></a>

Returns items of a table.

> If the total number of scanned items exceeds the maximum data set size limit of 1 MB,
the scan stops and results are returned to the user as a LastEvaluatedKey value to continue the scan in a subsequent operation.

See [DynamoDB.scan](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) for more information.

##client.table("tableName").scanAll(params) <a id="client-table-scanall"></a>

Uses `client.table("tableName").scan()` to scan all items of a table.

# DynamoDB methods
Additionally we expose the underlying promisified methods to access the native DynamoDB methods.

**Example**
```javascript
return client.dynamo.getItem(params);
// return client.dynamo.batchWriteItem(params);
```
