# LSP Browser textarea
```shell
npm run example_4
```

Will try to figure out running an LSP Client and connecting to it through the browser using websockets.

# Initial Setup
We will make a `webapp.js` file to serve a static `index.html` with a textarea dn websocket connection.

`webapp.js`

```js
// ----------------------------
// websockets
// ----------------------------
const wsServer = new WebSocketServer({
   port: 2180, 
})

// send connection to our Server.js
var sockets = []
wsServer.on('connection', (ws, req) => {
   console.log('connection!')
   var socket = { ws }

   ws.on('message', data => {
      // console.log('meow', data.toString())
      onSocketMessage(socket, JSON.parse(data.toString()))
   })

   ws.on('close', () => {
      console.log('closing socket')
   })

   sockets.push(socket)
})

function onSocketMessage(socket, { type, data }) {
   console.log('onSocketMessage', type, data)
}


console.log(`[HTTP PORT] 1180`)
```



# LSP Setup
Going to copy the client.js file from 3_lsp_server. Then convert it into a reusable module/class.




#### References
- websockets: https://github.com/websockets/ws
- ws text basics: https://github.com/websockets/ws#sending-and-receiving-text-data

