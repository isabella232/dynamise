## Functions
<dl>
<dt><a href="#set">set(definitions)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#get">get(definition)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#listTables">listTables(params)</a> ⇒ <code>Promise</code></dt>
<dd><p>You will get an array with all the table names associated with the endpoint.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html">DynamoDB.listTables</a> for more information.</p>
</dd>
<dt><a href="#create">create(tableName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Adds a new table if it does exist in <code>/tables</code>. Otherwise you are able to hand over a complete table object.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html">DynamoDB.createTable</a> for more information.</p>
</dd>
<dt><a href="#read">read(tableName)</a> ⇒ <code>Promise</code></dt>
<dd><p>You will get certain information about the table specified.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html">DynamoDB.describeTable</a> for more information.</p>
<blockquote>
<p>Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.</p>
</blockquote>
</dd>
<dt><a href="#remove">remove(tableName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes the table and all of its items.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteTable.html">DynamoDB.deleteTable</a> for mor information.</p>
</dd>
<dt><a href="#status">status(tableName)</a> ⇒ <code>Promise</code></dt>
<dd><p>This function uses <code>client.read(tableName)</code> but only fetches the following information:</p>
<ul>
<li>TableSizeBytes (total size in bytes)</li>
<li>TableStatus (CREATING, DELETING, UPDATING, ACTIVE)</li>
<li>ItemCount (number of items)</li>
</ul>
<p>and if the table is <em>upgradable</em> (true|false).</p>
</dd>
<dt><a href="#active">active(tableName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Checks if the table state is <code>ACTIVE</code> and returns an object with table data. If the table is not active it waits for the table to become active.</p>
<p>Uses <code>client.read(tableName)</code> and therefore <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html">DynamoDB.describeTable</a>.</p>
</dd>
<dt><a href="#recreate">recreate(tableName)</a> ⇒ <code>Promise</code></dt>
<dd><p>Recreates the table if exists or creates the table if not and waits until active.</p>
</dd>
<dt><a href="#multiUpsert">multiUpsert(tables)</a> ⇒ <code>Promise</code></dt>
<dd><p>Does an multiUpsert on the tables specified in the tables object.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html">DynamoDB.batchWriteItem</a> for more information.</p>
</dd>
<dt><a href="#multiRead">multiRead(params)</a> ⇒ <code>Promise</code></dt>
<dd><p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html">DynamoDB.batchGetItem</a> for more information.</p>
</dd>
<dt><a href="#create">create(item)</a> ⇒ <code>Promise</code></dt>
<dd><p>Creates an item at the specified table.</p>
<p><strong>NOTE:</strong> You are not able to replace an item. It is only created if the item does not exist yet.</p>
</dd>
<dt><a href="#read">read(hash, range)</a> ⇒ <code>Promise</code></dt>
<dd><p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html">DynamoDB.getItem</a>.</p>
</dd>
<dt><a href="#patch">patch(item)</a> ⇒ <code>Promise</code></dt>
<dd><p>Use to update an existing item.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html">DynamoDB.updateItem</a> for more information.</p>
</dd>
<dt><a href="#upsert">upsert(item)</a> ⇒ <code>Promise</code></dt>
<dd><p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html">DynamoDB.putItem</a> for more information.</p>
</dd>
<dt><a href="#multiRead">multiRead(items)</a> ⇒ <code>Promise</code></dt>
<dd><p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html">DynamoDB.batchGetItem</a> for more information.</p>
</dd>
<dt><a href="#multiUpsert">multiUpsert(items)</a> ⇒ <code>Promise</code></dt>
<dd><p>Uses the <em>batchWriteItem</em> method from AWS.DynamoDB to do an upsert on many items. Note that <em>batchWriteItem</em> cannot update items. Items which already exist are fully replaced.</p>
<p><strong>NOTE:</strong> If you want to multiUpsert on different tables use the client.multiUpsert() method. Actually, this method is using it either.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html">DynamoDB.batchWriteItem</a> for more information.</p>
</dd>
<dt><a href="#upload">upload(input)</a> ⇒ <code>Promise</code></dt>
<dd><p>Upload an array of items using multiUpsert. Returns a Promise which handles the events internally.</p>
<p><strong>NOTE:</strong> Currently this is only an alias for client.table(&quot;tableName&quot;).multiUpsert()</p>
</dd>
<dt><a href="#createUploadStream">createUploadStream()</a> ⇒ <code>UploadStream</code></dt>
<dd><p>Returns an instance of <code>UploadStream</code> to handle an upload via stream manually.</p>
</dd>
<dt><a href="#download">download(params)</a> ⇒ <code>Promise</code></dt>
<dd><p>Actually this is an alias for <code>clieb.table(tableName).scanAll()</code> - does a complete scan.</p>
</dd>
<dt><a href="#createDownloadStream">createDownloadStream()</a> ⇒ <code>DownloadStream</code></dt>
<dd><p>Returns an instance of <code>DownloadStream</code> to handle a download manually.</p>
</dd>
<dt><a href="#remove">remove(hash, range)</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes a single item in a table.</p>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html">DynamoDB.deleteItem</a> for more information.</p>
</dd>
<dt><a href="#find">find(params)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#findAll">findAll(params)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#query">query(params)</a> ⇒ <code>Promise</code></dt>
<dd><p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html">DynamoDB.query</a> for more information.</p>
</dd>
<dt><a href="#scan">scan(params)</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns items of a table.</p>
<blockquote>
<p>If the total number of scanned items exceeds the maximum data set size limit of 1 MB, the scan stops and results are returned to the user as a LastEvaluatedKey value to continue the scan in a subsequent operation.</p>
</blockquote>
<p>See <a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html">DynamoDB.scan</a> for more information.</p>
</dd>
<dt><a href="#scanAll">scanAll(params)</a> ⇒ <code>Promise</code></dt>
<dd><p>Uses <code>client.table(&quot;tableName&quot;).scan()</code> to scan all items of a table.</p>
</dd>
</dl>
<a name="set"></a>
## set(definitions) ⇒ <code>Promise</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| definitions | <code>Object</code> | 

<a name="get"></a>
## get(definition) ⇒ <code>Promise</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| definition | <code>Object</code> | 

<a name="listTables"></a>
## listTables(params) ⇒ <code>Promise</code>
You will get an array with all the table names associated with the endpoint.

See [DynamoDB.listTables](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

<a name="create"></a>
## create(tableName) ⇒ <code>Promise</code>
Adds a new table if it does exist in `/tables`. Otherwise you are able to hand over a complete table object.

See [DynamoDB.createTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| tableName | <code>String</code> | 

<a name="read"></a>
## read(tableName) ⇒ <code>Promise</code>
You will get certain information about the table specified.

See [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html) for more information.

> Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.

**Kind**: global function  

| Param | Type |
| --- | --- |
| tableName | <code>String</code> | 

<a name="remove"></a>
## remove(tableName) ⇒ <code>Promise</code>
Deletes the table and all of its items.

See [DynamoDB.deleteTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteTable.html) for mor information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| tableName | <code>String</code> | 

<a name="status"></a>
## status(tableName) ⇒ <code>Promise</code>
This function uses `client.read(tableName)` but only fetches the following information:

- TableSizeBytes (total size in bytes)
- TableStatus (CREATING, DELETING, UPDATING, ACTIVE)
- ItemCount (number of items)

and if the table is *upgradable* (true|false).

**Kind**: global function  

| Param | Type |
| --- | --- |
| tableName | <code>String</code> | 

<a name="active"></a>
## active(tableName) ⇒ <code>Promise</code>
Checks if the table state is `ACTIVE` and returns an object with table data. If the table is not active it waits for the table to become active.

Uses `client.read(tableName)` and therefore [DynamoDB.describeTable](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html).

**Kind**: global function  

| Param | Type |
| --- | --- |
| tableName | <code>String</code> | 

<a name="recreate"></a>
## recreate(tableName) ⇒ <code>Promise</code>
Recreates the table if exists or creates the table if not and waits until active.

**Kind**: global function  

| Param | Type |
| --- | --- |
| tableName | <code>String</code> | 

<a name="multiUpsert"></a>
## multiUpsert(tables) ⇒ <code>Promise</code>
Does an multiUpsert on the tables specified in the tables object.

See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| tables | <code>Object</code> | 

<a name="multiRead"></a>
## multiRead(params) ⇒ <code>Promise</code>
See [DynamoDB.batchGetItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

<a name="create"></a>
## create(item) ⇒ <code>Promise</code>
Creates an item at the specified table.

**NOTE:** You are not able to replace an item. It is only created if the item does not exist yet.

**Kind**: global function  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 

<a name="read"></a>
## read(hash, range) ⇒ <code>Promise</code>
See [DynamoDB.getItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html).

**Kind**: global function  

| Param | Type |
| --- | --- |
| hash | <code>String</code> | 
| range | <code>String</code> | 

<a name="patch"></a>
## patch(item) ⇒ <code>Promise</code>
Use to update an existing item.

See [DynamoDB.updateItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 

<a name="upsert"></a>
## upsert(item) ⇒ <code>Promise</code>
See [DynamoDB.putItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 

<a name="multiRead"></a>
## multiRead(items) ⇒ <code>Promise</code>
See [DynamoDB.batchGetItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| items | <code>Array</code> | 

<a name="multiUpsert"></a>
## multiUpsert(items) ⇒ <code>Promise</code>
Uses the *batchWriteItem* method from AWS.DynamoDB to do an upsert on many items. Note that *batchWriteItem* cannot update items. Items which already exist are fully replaced.

**NOTE:** If you want to multiUpsert on different tables use the client.multiUpsert() method. Actually, this method is using it either.

See [DynamoDB.batchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| items | <code>Array</code> | 

<a name="upload"></a>
## upload(input) ⇒ <code>Promise</code>
Upload an array of items using multiUpsert. Returns a Promise which handles the events internally.

**NOTE:** Currently this is only an alias for client.table("tableName").multiUpsert()

**Kind**: global function  

| Param | Type |
| --- | --- |
| input | <code>Array</code> | 

<a name="createUploadStream"></a>
## createUploadStream() ⇒ <code>UploadStream</code>
Returns an instance of `UploadStream` to handle an upload via stream manually.

**Kind**: global function  
<a name="download"></a>
## download(params) ⇒ <code>Promise</code>
Actually this is an alias for `clieb.table(tableName).scanAll()` - does a complete scan.

**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

<a name="createDownloadStream"></a>
## createDownloadStream() ⇒ <code>DownloadStream</code>
Returns an instance of `DownloadStream` to handle a download manually.

**Kind**: global function  
<a name="remove"></a>
## remove(hash, range) ⇒ <code>Promise</code>
Deletes a single item in a table.

See [DynamoDB.deleteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) for more information.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>String</code> | The hash key of the table |
| range | <code>String</code> | The range key of the table |

<a name="find"></a>
## find(params) ⇒ <code>Promise</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

<a name="findAll"></a>
## findAll(params) ⇒ <code>Promise</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

<a name="query"></a>
## query(params) ⇒ <code>Promise</code>
See [DynamoDB.query](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

<a name="scan"></a>
## scan(params) ⇒ <code>Promise</code>
Returns items of a table.

> If the total number of scanned items exceeds the maximum data set size limit of 1 MB, the scan stops and results are returned to the user as a LastEvaluatedKey value to continue the scan in a subsequent operation.

See [DynamoDB.scan](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) for more information.

**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

<a name="scanAll"></a>
## scanAll(params) ⇒ <code>Promise</code>
Uses `client.table("tableName").scan()` to scan all items of a table.

**Kind**: global function  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 

