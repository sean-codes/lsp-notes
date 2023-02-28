import * as cp from 'child_process'
import * as path from 'path'
import * as url from 'url'
import * as lsp from 'vscode-languageserver/node.js'
import * as rpc from 'vscode-jsonrpc/node.js'
import { 
   CancellationToken, 
   InitializeParams, 
   InitializeRequest, 
   InitializeResult, 
   TextDocumentSyncKind 
} from 'vscode-languageserver-protocol'

var __filename = url.fileURLToPath(import.meta.url)
var __dirname = path.dirname(__filename)


// var lspTs = new LSP_typescript()
// lspTs.onDiagnostics = function(data) {
//    console.log('meow', data)
// }


export class LSP_typescript {
   connection: any;
   childProcess: any;

   constructor() {
      var serverPath = path.join('node_modules/typescript-language-server/lib/cli.mjs')
      this.childProcess = cp.spawn('node', [serverPath, '--stdio'])

      this.connection = lsp.createConnection(
         new rpc.StreamMessageReader(this.childProcess.stdout),
         new rpc.StreamMessageWriter(this.childProcess.stdin),
      )

      this.connection.listen()

      // this.connection.onNotification((method) => {
      //    console.log('notification', method)
      // })

      this.connection.onNotification('window/logMessage', (params) => {
         // console.log('server log: ', JSON.stringify(params, null, 3))
      })

      this.connection.onNotification('textDocument/publishDiagnostics', (params) => {
         // console.log('publishDiagnostics', JSON.stringify(params, null, 3))
         this.onDiagnostics(params)
      })

      this.connection.onInitialize((params: InitializeParams) => {
         console.log('this.connection.onInitialize')
   
         const result: InitializeResult = {
            capabilities: {
               textDocumentSync: TextDocumentSyncKind.Full,
               completionProvider: {
                  resolveProvider: true,
               }
            }
         }
   
         return result
      })

      var initRequestParams: InitializeParams = {
         processId: process.pid,
         rootUri: 'file:///Users/workbook/Desktop/ts-server/notes.md',
         capabilities: {},
      } 

      this.connection.sendRequest(InitializeRequest.method, initRequestParams)
   }

   onDiagnostics(data) {}
   sendOpen(textDocument = { uri: '', text: '' }) {
      this.send('textDocument/didOpen', { textDocument })
   }

   send(type, message) {
      //'textDocument/didOpen',
      this.connection.sendNotification(type, message)
   }

   close() {
      this.childProcess.kill()
   }
}




// import * as rpc from 'vscode-jsonrpc/node.js'

// lsp and lspText
// console.log(lsp)
// import * as lspTypescript from 'typescript-language-server'


// let childProcess = cp.spawn('node', [path.join(__dirname, 'server.js')]);

// childProcess.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// childProcess.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// childProcess.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });






// let notification = lsp.DidOpenTextDocumentNotification
// console.log(notification)
// let notification = new rpc.NotificationType('hello_world');
// connection.sendNotification(notification);
// let notification = lsp.DidOpenTextDocumentNotification

// connection.sendNotification(notification.method, "meow Meow");

// console.log('meow')
// connection.onRequest((method) => {
//    console.log('on request', method)
// })

// var cancelToken = CancellationToken



// console.log('meow')

// connection.onInitialize(console.log)
// connection.onInitialized(console.log)

// console.log(lsp.TransportKind.stdio)
// var serverOptions = {
//    run: { module: './src/server.mjs', transport: lsp.TransportKind.stdio }
// }

// var connection = lsp.createConnection(lsp.ProposedFeatures.all)

// var texts = new lsp.TextDocuments(lspText.TextDocument)

// connection.onInitialize(initParams => {
//    console.log('initializing?', initParams)
// })



// console.log(lsp)
// const lspText = require('vscode-languageserver-textdocument')
// console.log(lspText)
// console.log('test')

// // Use stdin and stdout for communication:
// let connection = rpc.createMessageConnection(
//    new rpc.StreamMessageReader(childProcess.stdout),
//    new rpc.StreamMessageWriter(childProcess.stdin),
// );



// connection.listen();

// let notification = new rpc.NotificationType('hello_world');
// connection.sendNotification(notification);
// connection.onNotification(notification, (response) => {
//    console.log(response)
// })

// const ls = cp.spawn('node', [path.join(__dirname, 'server.mjs')]);

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });