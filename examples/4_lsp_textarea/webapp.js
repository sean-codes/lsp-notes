import http from 'http'
import express from 'express'
import WebSocket, { WebSocketServer } from 'ws'
import * as lsp from 'vscode-languageserver'
import { LspClient } from './lsp_client.js'

// ----------------------------
// static express app
// ----------------------------
const app = express()
app.use(express.static('./examples/4_lsp_textarea', { maxage: '1d' }))

// use http
const serverHttp = http.createServer(app)
serverHttp.listen(1180)



// ----------------------------
// websockets
// ----------------------------
const wsServer = new WebSocketServer({
   port: 2180, 
})

// send connection to our Server.js
var sockets = []
wsServer.on('connection', (ws, req) => {
   console.log('wsServer: connection!')

   //-----------------------------------------------
   // TS Server
   //-----------------------------------------------
   var lspConnection = LspClient({
      onReady: () => ws.send(JSON.stringify({ type: 'ready' }))
   })
   lspConnection.onNotification(lsp.PublishDiagnosticsNotification, (message) => {
      // console.log('PublishDiagnosticsNotification', message)
      ws.send(JSON.stringify({ 
         type: 'diagnostic', 
         data: { ...message }
      }))
   })

   var socket = { ws, lspConnection }

   ws.on('message', data => {
      onSocketMessage(socket, JSON.parse(data.toString()))
   })

   ws.on('close', () => {
      console.log('closing socket')
      lspConnection.dispose()
   })

   sockets.push(socket)
})

function onSocketMessage(socket, { type, data }) {
   console.log('onSocketMessage', type, data)

   switch(type) {
      case 'doc': 
         var textDocument = { uri: '', text: data.doc }
         socket.lspConnection.sendNotification('textDocument/didOpen', { textDocument })
         break;
   }
}


console.log(`[HTTP PORT] 1180`)