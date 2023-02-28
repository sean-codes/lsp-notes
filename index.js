import http from 'http'
import express from 'express'
import WebSocket, { WebSocketServer } from 'ws'
import { LSP_typescript } from './bin/client.js'
// console.log(LSP_typescript)
// ----------------------------
// setup express app
// ----------------------------
const app = express()
// make client and engine public
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    next()
})
app.use(express.static('./', { maxage: '1d' }))
// livelyness probe
app.get('/live', (req, res) => res.send('live'))

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
var id = 0
var sockets = []
wsServer.on('connection', (ws, req) => {
    id += 1
    ws.send(JSON.stringify({ type: 'id', data: { id } }))
    console.log('connection!')

    //-----------------------------------------------
    // TS Server
    //-----------------------------------------------
    var lspTs = new LSP_typescript()
    lspTs.onDiagnostics = (data) => {
        // console.log('diagnostic', data)
        // console.log('meow', data)
        ws.send(JSON.stringify({ 
            type: 'diagnostic', 
            data: { ...data }
        }))
    }

    var socket = { ws, lsp: lspTs }

    ws.on('message', data => {
        // console.log('meow', data.toString())
        onSocketMessage(socket, JSON.parse(data.toString()))
    })

    ws.on('close', () => {
        console.log('closing socket')
        lspTs.close()
    })

    sockets.push(socket)
})

function onSocketMessage(socket, { id, type, data }) {
    // console.log(id, data, type)

    switch (type) {
        case 'doc':
            // console.log('doc?', data)
            socket.lsp.sendOpen({ uri: '', text: data.doc })
            break;
    }
}





console.log(`[HTTP PORT] 1180`)