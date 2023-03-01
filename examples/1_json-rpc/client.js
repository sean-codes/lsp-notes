import * as cp from 'child_process'
import * as rpc from 'vscode-jsonrpc/node.js'

//-----------------------------------------------------------
// start up server
//-----------------------------------------------------------
// spawn takes a function "node" and arguments as an array
var pathToServer = './examples/1_json-rpc/server.js'
var childProcess = cp.spawn('node', [ pathToServer ])

//-----------------------------------------------------------
// JSON RPC for communication!
//-----------------------------------------------------------
// create the connection
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
var notificationX = new rpc.NotificationType('x')
connection.sendNotification(notificationX, 'hello from client!!')