# LSP Browser textarea
Will try to figure out running an LSP Client and connecting to it through the browser using websockets.

# Example

```shell
npm run example_4
```

[See complete code](https://github.com/sean-codes/lsp-notes/tree/main/examples/4_lsp_textarea)


## Initial Setup
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



## LSP Setup
Copy the client.js file from 3_lsp_server. Then convert it into a reusable module/class.

```js
export function LspClient({ onReady }) {
   // start server
   var childProcess = cp.spawn('node', ['./node_modules/typescript-language-server/lib/cli.mjs', '--stdio']);
   // childProcess.stdout.on('data', (data) => console.log(`${data}`))

   //----------------------------------------------
   // Initialize
   //----------------------------------------------
   var connection = lsp.createConnection(
      new rpc.StreamMessageReader(childProcess.stdout), // out
      new rpc.StreamMessageWriter(childProcess.stdin), // in
   )

   connection.listen()

   connection.sendRequest(lsp.InitializeRequest, {
      processId: process.pid,
      rootUri: '',
      capabilities: {},
   }).then((result) => {
      console.log('lsp_client.js: Client Initialized!')
      onReady()
   })


   return connection
}

```




#### References
- websockets: https://github.com/websockets/ws
- ws text basics: https://github.com/websockets/ws#sending-and-receiving-text-data

