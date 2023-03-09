# lsp external
the main benefit of lsp is that the servers can be written in any language and used in any language! This project will only have a `client.js` and it will run a installed server.

We can find servers here: https://microsoft.github.io/language-server-protocol/implementors/servers/

For this project we will try to use the typescript server with our own client!
https://github.com/typescript-language-server/typescript-language-server


# Example
```shell
npm run example_3
```

[See complete code](https://github.com/sean-codes/lsp-notes/tree/main/examples/3_lsp_server)


## Run the server
```js
// run a server from node_modules
var childProcess = cp.spawn('node', ['./node_modules/typescript-language-server/lib/cli.mjs', '--stdio']);
```

## Initialize
We initialize the same way as if we had our own `server.js`


```js
// connect as usual
var connection = lsp.createConnection(
   new rpc.StreamMessageReader(childProcess.stdout), // out
   new rpc.StreamMessageWriter(childProcess.stdin), // in
)

// initialize!
connection.sendRequest(lsp.InitializeRequest, {
   processId: process.pid,
   rootUri: 'file:///Users/workbook/Desktop/ts-server/notes.md',
   capabilities: {},
}).then((result) => {
   console.log('Client Initialized!')
   console.log('------------------------')
   sendOpenFileNotification()
})
```


After initialization we can send an open file notification. We need to format the text document following the LSP specification!

```js
function sendOpenFileNotification() {
   connection.sendNotification('textDocument/didOpen', { 
      textDocument: {
         uri: '', 
         text: 'this is a TEST' 
      }
   })
}
```

---

#### references
- https://github.com/microsoft/vscode-languageserver-node