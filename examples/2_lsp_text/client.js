import * as lsp from 'vscode-languageserver'
import * as rpc from 'vscode-jsonrpc' // lsp communicates using json rpc!
import * as cp from 'child_process'

// start server
var childProcess = cp.spawn('node', ['./examples/2_lsp_text/server.js']);
// childProcess.stdout.on('data', (data) => console.log(`${data}`))

//----------------------------------------------
// Initialize
//----------------------------------------------
var connection = lsp.createConnection(
   new rpc.StreamMessageReader(childProcess.stdout), // out
   new rpc.StreamMessageWriter(childProcess.stdin), // in
)


connection.listen()

// A request is thenable!
connection.sendRequest(lsp.InitializeRequest, {
   processId: 0,
   rootUri: '',
   capabilities: {},
}).then((r) => {
   console.log('Client Initialized!')
   console.log('-----------------------')
   sendOpenFileNotification()
})



//----------------------------------------------
// Send Notifications (open file)
//----------------------------------------------
function sendOpenFileNotification() {
   // ‘textDocument/didOpen’
   // https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_didOpen   

   var exampleText = 'this is a TEST'
   // send this as an array to use as params to create on server
   var textDocument = ['', '', 0, exampleText] 

   connection.sendNotification(lsp.DidOpenTextDocumentNotification, { textDocument })
}

//----------------------------------------------
// Listen Notifications
//----------------------------------------------
// diagnostics handler
connection.onNotification(lsp.PublishDiagnosticsNotification, (message) => {
   console.log('PublishDiagnosticsNotification', message)
})

// default notification handler
connection.onNotification((type, message) => {
   console.log('notification', type, message)
})
