# lsp language server protocol

lsp does linting and helps with editor functions like goto definition / autocomplete.

lsp communicates using json rpc!

The protocol for communication has been defined on microsofts website. We are going to use a package for json-rpc and lsp allowing to somewhat skip the initial parts of the protocol and jump right into the lifecycle!

lifecycle: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#lifeCycleMessages

### Vocabulary
**capabilities** = goto, autocomplete, etc
**diagnostics** = errors / warnings 

### Basics
------
1. initialize with capabilities (request)
3. send notifications/diagnostics (open file, change file, etc)
4. exit (when done)


> note: these basic bits like initialization and diagnostics seem to often have specifically defined function! For example; `sendRequest, onInitialize, sendDiagnostics`. We want to try and use these even though getting javascript objects to match the typescript makes it look yikes :< 

#### Initialize

From the client send an initialization request. 

**NOTE:** a request in json rpc must be responded to. Unlike notifications `sendRequest` is thenable!

```js
// client.js
connection.sendRequest(lsp.InitializeRequest, {
   processId: 0,
   rootUri: '',
   capabilities: {},
}).then((r) => {
   console.log('Client Initialized!')


   // can do anything!
   sendOpenFileNotification() 
})
```


On the server listen for on `onInitialize` and send back a `InitializedNotification`!

```js
// server.js
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

   // send initialized complete! (this shows up as the argument for then)
   return result
})
```


# Send file open and get diagnostics
We will send an open notification with text document parameters to the server.

To make it easier on the server we will write the text document as an array `[uri, languageId, version, `
```js
function sendOpenFileNotification() {
   var exampleText = 'this is a TEST'
   // send this as an array to use as params to create on server
   var textDocument = ['', '', 0, exampleText] 

   connection.sendNotification(lsp.DidOpenTextDocumentNotification, { textDocument 
   })
}
```

---

#### References:

json rpc: https://www.jsonrpc.org/specification
protocol: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#lifeCycleMessages
microsoft lsp: https://microsoft.github.io/language-server-protocol/