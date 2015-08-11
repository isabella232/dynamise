# Dynamise

[![Build Status](https://travis-ci.org/epha/dynamise.svg?branch=master)](https://travis-ci.org/epha/dynamise) [![Dependency Status](https://david-dm.org/epha/dynamise.svg)](https://david-dm.org/epha/dynamise) [![devDependency Status](https://david-dm.org/epha/dynamise/dev-status.svg)](https://david-dm.org/epha/dynamise#info=devDependencies)

Dynamise wraps the native DynamoDB methods from `aws-sdk` for node.js in promisifed versions and also provides some sugar syntax to interact with your database.

**Examples:** Look into the example folder to learn about the available functions

# API Docs
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
  - [client.**multiRead()**](#client-multiread)
  - [client.table("tableName").**multiUpsert()**](#client-table-multiupsert)
  - [client.table("tableName").**read()**](#client-table-read)
  - [client.table("tableName").**patch()**](#client-table-patch)
  - [client.table("tableName").**upsert()**](#client-table-upsert)
  - [client.table("tableName").**upload()**](#client-table-upload)
  - [client.table("tableName").**createUploadStream()**](#client-table-createuploadstream)
  - [client.table("tableName").**download()**](#client-table-download)
  - [client.table("tableName").**createDownloadStream()**](#client-table-createdownloadstream)
  - [client.table("tableName").**remove()**](#client-table-remove)
  - [client.table("tableName").**find()**](#client-table-find)
  - [client.table("tableName").**query()**](#client-table-query)
  - [client.table("tableName").**scan()**](#client-table-scan)
  - [client.table("tableName").**scanAll()**](#client-table-scanall)
3. Others
  - [client.**endpoint()**](#client-endpoint)

## client.endpoint() <a id="client-endpoint"></a>

Return the actual endpoint

```javascript
var endpoint = client.endpoint();

/*
e.g.

{ protocol: 'http:',
  host: 'localhost:8000',
  port: 8000,
  hostname: 'localhost',
  pathname: '/',
  path: '/',
  href: 'http://localhost:8000/',
  title: 'local' }
*/
```

## client.listTables(params) <a id="client-listtables"></a>

You will get an array with all the table names associated with the endpoint.

```javascript
client.listTables()
  .then(function (res) {
    console.log(res.TableNames); // ['TableOne', 'TableTwo', 'TableThree']
  });
```

See [DynamoDB.listTables](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html) for more information.

## client.create("tableName") <a id="client-create"></a>

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

## client.read("tableName") <a id="client-read"></a>

You will get certain information about the table specified.

```javascript
client.read("TableOne")
  .then(function (res) {
    console.log(res);
  });
```

You response might look like this:

```javascript
{ AttributeDefinitions:
   [ { AttributeName: 'id', AttributeType: 'S' }, ... ],
  TableName: 'TableOne',
  ProvisionedThroughput:
   { ... },
  KeySchema:
   [ { AttributeName: 'id', KeyType: 'HASH' } ],
  CreationDateTime: Wed Jun 10 2015 16:47:24 GMT+0200 (CEST),
  ItemCount: 0,
  TableSizeBytes: 0,
  TableStatus: 'ACTIVE' }
```

See [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html) for more information.

> Returns information about the table, including the current status of the table, when it was created,
the primary key schema, and any indexes on the table.


## client.remove("tableName") <a id="client-remove"></a>

Deletes the table and all of its items.

```javascript
// Assume "TableOne" exists
client.remove("TableOne")
 .then(function (res) {
   // res contains a TableDescription object
   // res.TableStatus === 'DELETING'
 });
```

See [DynamoDB.deleteTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteTable.html) for mor information.

## client.status("tableName") <a id="client-status"></a>

This function uses `client.read(tableName)` but only fetches the following information:

- TableSizeBytes (total size in bytes)
- TableStatus (CREATING, DELETING, UPDATING, ACTIVE)
- ItemCount (number of items)

and if the table is *upgradable* (true|false).

```javascript
client.status("TableOne")
  .then(function (res) {
    // do something with res
  })
  .catch(function (err) {
    // throws a ResourceNotFoundException if table does not exist
  });
```

A response object might look like this:

```javascript
{ TableSizeBytes: 0,
  TableStatus: 'ACTIVE',
  ItemCount: 0,
  Upgradable: false }
```

## client.active("tableName") <a id="client-active"></a>

Checks if the table state is `ACTIVE` and returns an object with table data. If the table is not active
it waits for the table to become active.

```javascript
client.active("TableOne")
  .then(function (res) {
    if (res.TableName === "TableOne") {
      console.log("You got the right table!");
    }
  });
```

Your response object might look like this:

```javascript
{ AttributeDefinitions:
   [ { AttributeName: 'id', AttributeType: 'S' },
  TableName: 'Example',
  ProvisionedThroughput:
   { ... },
  KeySchema:
   [ { AttributeName: 'id', KeyType: 'HASH' } ],
  CreationDateTime: Thu Jun 11 2015 15:31:42 GMT+0200 (CEST),
  ItemCount: 0,
  TableSizeBytes: 0,
  TableStatus: 'ACTIVE' }
```

Uses `client.read(tableName)` and therefore [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html).

## client.update(params) <a id="client-update"></a>

Update the Provisioned Throughput for the given table. You are also able to add and/or update global secondary indexes.

See [DynamoDB.updateTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateTable.html)

##client.recreate("tableName") <a id="client-recreate"></a>

Recreates the table if exists or creates the table if not and waits until active.

## client.multiUpsert(tables) <a id="client-multiupsert"></a>

Does an multiUpsert on the tables specified in the tables object. The param `tables` should look like

```javascript
var tables = {
  "TableA": [item1, item2, ...],
  "TableB": [item1, item2, ...]
}
```

See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.

## client.multiRead(params) <a id="client-multiread"></a>

Returns an object with a TableName attribute containing an array with all read items.

```javascript
var params = {
  RequestItems: {
    Example:{ // TableName
      Keys:[
        {id:"1", email:"m@epha.ch"},
        {id:"1", FileId:"d@epha.ch"},
        // ...
      ]
    }
  }
};

client.multiRead(params)
  .then(function (resItems) {
    // do something
  };
```

See [DynamoDB.batchGetItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) for more information.

## client.table("tableName").read(hash,range) <a id="client-table-read"></a>

```javascript
client.table("Example").read("1", "m@epha.com")
  .then(function (resItem) {
    if(!resItem) {
      // there is no such item
    }
    // do something with the item
  };
```

Returns an item with the given hash and range (primary key). If there exists no such item in the database, nothing will be returned.



See [DynamoDB.getItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html).

## client.table("tableName").patch(item) <a id="client-table-patch"></a>

With `patch()` you can do the following operations on your item:
- Add new attributes
- Delete attributes
- Update attributes

```javascript
// the following item does already exist in the database
var item = {
  id: "1", // hash
  email: "m@epha.com",
  name: "markus",
  points: "3",
  role: "user"
}

client.table("Example").patch({
  id: "1",  // hash and/or range keys cannot be updated
  points: null, // will be removed
  role: "admin", // will be updated
  rule: "user-management" // will be added
});
```

See [DynamoDB.updateItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) for more information.

## client.table("tableName").upsert(item) <a id="client-table-upsert"></a>

```javascript
var item = {id: "1", email: "m@epha.com"};

client.table("Example").upsert(item);
```

Creates a new item. If the item already exists, it will be fully replaced.

See [DynamoDB.putItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) for more information.

## client.table("tableName").multiUpsert(items) <a id="client-table-multiupsert"></a>

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

## client.table("tableName").upload(items) <a id="client-table-upload"></a>

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

## client.table("tableName").createUploadStream() <a id="client-table-createuploadstream"></a>

Returns an instance of `UploadStream` to handle an upload via stream manually.

There are mainly two possible scenarios to use the UploadStream

1. download one whole table from a database and upload it to another database
2. upload data from a JSON file

### Use DownloadStream to upload data to another database using UploadStream

```javascript
var downloadStream = client.table("TableOne").createDownloadStream();
var uploadStream = client.table("TableTwo").createUploadStream();

downloadStream.pipe(uploadStream);

uploadStream.on("finish", function () {
  console.log("finished uploading items");
});

uploadStream.on("error", function (err) {
  console.trace(err);
});

```

### Upoad data from a JSON file using UploadStream

In this case you will need [JSONStream](https://github.com/dominictarr/JSONStream) to pipe data accordingly to UploadStream.

```javascript
var fs = require("fs");
var path = require("path");
var jsonStream = require("JSONStream").parse("*");
var uploadStream = client.table("Example").createUploadStream();

// Read data from a file using fs.createReadStream()
var jsonFileStream = fs.createReadStream(path.resolve(__dirname, "data.json"));

// And now pipe anything to uploadStream
jsonFileStream.pipe(jsonStream).pipe(uploadStream);

uploadStream.on("finish", function () {
  console.log("finished uploading items");
});

uploadStream.on("error", function (err) {
  console.error(err);
});
```

## client.table("tableName").download() <a id="client-table-download"></a>

Actually this is an alias for [`client.table(tableName).scanAll()`](#client-table-scanall) - does a complete scan.

## client.table("tableName").createDownloadStream() <a id="client-table-createdownloadstream"></a>

Returns an instance of `DownloadStream` to handle a download manually.

```javascript
var download = client.table("TableOne").createDownloadStream();
var downloadedItems = [];

download.on("data", function (chunk) {
  downloadedItems.push(chunk);
});

download.on("end", function () {
  console.log("finished downloading " + downloadedItems.length + " items");
});

download.on("error", console.error);
```

## client.table("tableName").remove(hash,range) <a id="client-table-remove"></a>

Deletes a single item in a table.

See [DynamoDB.deleteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) for more information.

## client.table("tableName").find(params) <a id="client-table-find"></a>

Used to find items based on conditions.

```javascript
client.table("Example")
      .find(params) // params is optional
      .where("UserId").equals("1") // hash key
      .and("FileId").equals("2");
      .run()
```

You are able to pass a *params Object* to `find()` with attributes defined in [DynamoDB.query](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html). We build some sugar functions to make this even easier.

**IMPORTANT NOTICE**: If you pass `KeyConditions` make sure you are using the correct signature related to [dynamodb-doc Condition Object](https://github.com/awslabs/dynamodb-document-js-sdk#condition-object). You have to hand over an array containing condition objects as described in the link above.

### - index()

The same as params would include `{ IndexName: "IndexNameValue" }`.

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

```javascript
client.table("Example")
    .find()
    .all()
    (...)
    .run();
```

### - where()

This is used to define a hash key where a certain `equals()` condition is applied to.

```javascript
client.table("Example")
  .find()
  .where("id").equals("1")
  .run();
```

**Note:** On hash keys you are only allowed to perform an `equals()` condition.

### - and()

This is used to define a range key where a certain condition is applied to.

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

## client.table("tableName").query(params) <a id="client-table-query"></a>

```javascript
var params = {
	TableName: "TableOne",
	KeyConditions: [
		client.Condition("id", "EQ", "1")
	]
}

client.table("TableOne").query(params)
	.then(function (res) {
	  // do something with your query
	});
```

Your response is an array with all items which fit your query conditions.

To know more about a params object, please
look at [DynamoDB.query](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html).

## client.table("tableName").scan(params) <a id="client-table-scan"></a>

Returns items of a table.

> If the total number of scanned items exceeds the maximum data set size limit of 1 MB,
the scan stops and results are returned to the user as a LastEvaluatedKey value to continue the scan in a subsequent operation.

```javascript
client.table("TableOne").scan()
  .then(function (res) {
    // do something with the items
  });
```

Your response object might look like this:

```javascript
{ Count: 8467,
  ScannedCount: 8467,
  Items: [ ... ], // array with 8467 items
  // LastEvaluatedKey:
}
```

This method is helpful in case of pagination. Look at the following example:

```javascript
var limit = 10;
client.table(tableName).scan({Limit: limit})
  .then(function (res) {
    // process res.Items
    console.log(res.Items);

    // are there still more items to fetch?
    if (res.LastEvaluatedKey) {
      console.log("There are still more items to fetch...");

      // build a new query with LastEvaluatedKey
      params = {
        Limit: 10,
        ExclusiveStartKey: res.LastEvalutedKey
      }

      // Now use this params object to query the next 10 items with scan(params)
    }
  })
  .catch(console.error);
```

**Note**: This is a very basic and simple example. You would write methods like `next()` to fetch the next x items and use it in a loop or wait for a user to query the next items. There is a more complex example in the `example/` directory.

See [DynamoDB.scan](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) for more information.

## client.table("tableName").scanAll(params) <a id="client-table-scanall"></a>

Uses `client.table("tableName").scan()` to scan all items of a table. You will get an array with all items of a table.

```javascript
client.table("TableOne").download()
  .then(function (res) {
    console.log(res.length) // number of items
  });
```

# Error Reporting

A small note on error reporting:
Please make sure to always use a `.catch()` block when working with the API, otherwise you might miss some errors.

```javascript
client.table("TableOne").scanAll()
  .then()
  .catch(function (err) {
    // log error, for example
    // console.trace(err.stack)
  });
```

# DynamoDB methods
Additionally we expose the underlying promisified methods to access the native DynamoDB methods.

```javascript
return client.dynamo.getItem(params);
// return client.dynamo.batchWriteItem(params);
```
