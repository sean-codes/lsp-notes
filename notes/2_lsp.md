# lsp language server protocol

lsp does linting and helps with editor functions like goto definition / autocomplete.

lsp communicates using json rpc!

The protocol for communication has been defined on microsofts website. We are going to use a package for json-rpc and lsp allowing to somewhat skip the initial parts of the protocol and jump right into the lifecycle!

lifecycle: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#lifeCycleMessages

### Basics
------
1. initialize
2. send over capabilities (goto, autocomplete, etc)
3. send notifications (open file, change file, etc)
4. exit (when done)



#### Initialize

From the client send an initialization request
```js
//client.js
var initializeRequest = lsp.InitializeRequest.method
connection.sendRequest(initializeRequest, {
   processId: 0,
   rootUri: '',
   capabilities: {},
})
```


On the server listen for on `onInitialize` and send back a `InitializedNotification`!

```js
//server.js
connection.onInitialize((params) => {
   logger.log('server connection.onInitialize', params)

   const result = {
      capabilities: {
         textDocumentSync: lsp.TextDocumentSyncKind.Full,
         completionProvider: {
            resolveProvider: true,
         }
      }
   }

   // send initialized complete!
   connection.sendNotification(lsp.InitializedNotification.method, result)
})
```


On the client listen for `onInitialized`. Once this is complete we can send over our document!

```js
connection.onInitialized(() => {
   console.log('Client Initialized!')

   // after initialization can start sending notifications!
})
```





References:
protocol: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#lifeCycleMessages
microsoft lsp: https://microsoft.github.io/language-server-protocol/