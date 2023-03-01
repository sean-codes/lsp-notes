# json rpc

JSON RPC builds on rpc. Basically communication between the two using json! In the first example we did not send output from the client to server with JSON RPC we will!


# initializing
The client needs to be able to send standard in/out to the server and vise versa. To do this we create a message connection and reverse the in/out between

```
client out = server in
client in = server out
```

> i believe rpc is peer to peer normally. Using client/server because it was the termanology i seen around microsoft repository.


# basic setup
See [example 1_json-rpc](../examples/1_json-rpc)

```
npm run example_1
```

`client.js`

```js
import * as cp from 'child_process'
import * as rpc from 'vscode-jsonrpc/node.js'

var pathToServer = './examples/1_json-rpc/server.js'
var childProcess = cp.spawn('node', [ pathToServer ])

// create the connection. NOTE OUT/IN REVERSED!!!
let connection = rpc.createMessageConnection(
   new rpc.StreamMessageReader(childProcess.stdout), // out
   new rpc.StreamMessageWriter(childProcess.stdin)) // in

// listen! we do the same on the server
connection.listen()

// notification handler
connection.onNotification((message) => {
  console.log('client.js onNotification: ', message)
})

// send a message to the server
connection.sendNotification('hello from client!!')
```

`server.js`

```js
import * as rpc from 'vscode-jsonrpc/node.js'

// create the connection. NOTE OUT/IN REVERSED!!!
let connection = rpc.createMessageConnection(
   new rpc.StreamMessageReader(process.stdin), // in
   new rpc.StreamMessageWriter(process.stdout)) // out

// listen
connection.listen()

// on notification handler
connection.onNotification((message) => {
   connection.sendNotification('hello from server!')
})
```

## Notification type
When using vscode jsonrpc you can specify a notification type and listen on those specific ones.

```js
// send notification with a type
var notificationX = new rpc.NotificationType('x')
connection.sendNotification(notificationX, 'hello from client!!')

//--------------------------------------
// onNotification handler options
//--------------------------------------

// option 1. set onNotification notificationType. function only calls
// for notificationX now!
connection.onNotification(notificationX, (message) => {
   ...
})

// option 2. do not specific and use argument. all notifications trigger this
// function and you can write ifs based on what you want to do.
connection.onNotification((notificationType, message) => {
   ...
})
```

## Server logger
To see what is happening on the server we can use a simple text file logger found in the util folder. Open `.log` in the root folder

References
-------------------------------------
github https://github.com/microsoft/vscode-languageserver-node/tree/main/jsonrpc
json rpc: https://www.jsonrpc.org/
