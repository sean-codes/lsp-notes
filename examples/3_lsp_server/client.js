import * as lsp from 'vscode-languageserver'
import * as rpc from 'vscode-jsonrpc' // lsp communicates using json rpc!
import * as cp from 'child_process'

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

var initializeRequest = lsp.InitializeRequest
connection.sendRequest(initializeRequest, {
   processId: process.pid,
   rootUri: 'file:///Users/workbook/Desktop/ts-server/notes.md',
   capabilities: {},
   initializationOptions: {
      tsserver: {
         // logDirectory: '/Users/workbook/Desktop/ts-server/ts-server-log',
         // logVerbosity: 'verbose'

      }
   }
}).then((result) => {
   console.log('Client Initialized!')
   console.log('------------------------')
   sendOpenFileNotification()
})



//----------------------------------------------
// Send Notifications (open file)
//----------------------------------------------
function sendOpenFileNotification() {
   // ‘textDocument/didOpen’
   // https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_didOpen   

   var exampleText = 'this is a TEST'
   var note = 'textDocument/didOpen'
   var textDocument = {
      uri: '', 
      text: exampleText 

   }
   connection.sendNotification(note, { 
      textDocument
   })
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