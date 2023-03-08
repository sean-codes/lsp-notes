import * as lsp from 'vscode-languageserver'
import * as rpc from 'vscode-jsonrpc' // lsp communicates using json rpc!
import * as cp from 'child_process'

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
