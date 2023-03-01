// import * as lsp from 'vscode-languageserver'
import * as lsp from 'vscode-languageserver'
import * as rpc from 'vscode-jsonrpc' // lsp communicates using json rpc!
import * as cp from 'child_process'
import * as logger from '../../util/logger.js'
import * as validator from '../../util/validateText.js'

logger.clear()

//----------------------------------------------
// Initialize
//----------------------------------------------
logger.log('server starting...')
var connection = lsp.createConnection(
   new rpc.StreamMessageReader(process.stdin), // in
   new rpc.StreamMessageWriter(process.stdout), // out
)
connection.listen()

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

//----------------------------------------------
// Listen Notifications
//----------------------------------------------
// listen for document did open
connection.onDidOpenTextDocument(params => {
   logger.log('onDidOpenTextDocument', params)

   // create text document using params
   var textDocument = lsp.TextDocument.create(...params.textDocument)

   // get diagnostics
   var diagnostics = validator.validateTextDocument(textDocument)
   logger.log('server diagnostics', diagnostics)

   // return to client!
   // connection.sendNotification(lsp.PublishDiagnosticsNotification, diagnostics)
   connection.sendDiagnostics({ uri: '', diagnostics })
})


// default listener
connection.onNotification(function(type, message) {
   logger.log('notification', type, message)
})


