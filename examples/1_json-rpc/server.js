import * as rpc from 'vscode-jsonrpc/node.js'
// we can use a text file to see what is happening on the server
import * as logger from '../../util/logger.js'
logger.clear()


//-----------------------------------------------------------
// JSON RPC for communication!
//-----------------------------------------------------------
// create the connection
let connection = rpc.createMessageConnection(
   new rpc.StreamMessageReader(process.stdin), // in
   new rpc.StreamMessageWriter(process.stdout)) // out

// listen
connection.listen()

// on notification handler
connection.onNotification((notificaitonType, message) => {
   logger.log('server.js onNotification', notificaitonType, message)
   connection.sendNotification('hello from server!')
})