import * as rpc from 'vscode-jsonrpc/node.js'
import { TextLogger } from './logger.js'

var logger = new TextLogger('./src/.log')
logger.clear()
logger.log('server: starting...')

import * as lsp from 'vscode-languageserver/node.js'
import * as lspText from 'vscode-languageserver-textdocument'
import { Diagnostic, DiagnosticSeverity, InitializeParams, InitializeResult, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node.js'
let documents: TextDocuments<lspText.TextDocument> = new TextDocuments(lspText.TextDocument);

// The example settings
interface ExampleSettings {
  maxNumberOfProblems: number;
}

const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;
// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();


logger.log('connection made')
var connection = lsp.createConnection(
   new rpc.StreamMessageReader(process.stdin),
   new rpc.StreamMessageWriter(process.stdout)
)

// var texts = new lsp.TextDocuments(lspText.TextDocument)
logger.log('demo!')

   
connection.listen()
connection.onInitialize((params: InitializeParams) => {
   logger.log('onInitialize')
   logger.log(params)

   const result: InitializeResult = {
      capabilities: {
         textDocumentSync: TextDocumentSyncKind.Full,
         completionProvider: {
            resolveProvider: true,
         }
      }
   }

   logger.log('returning result')
   return result
})

connection.onInitialized(() => {
   connection.console.log('initialized?')
   logger.log('onInitialized-----------')
})



connection.onDidOpenTextDocument((params: any) => {
   logger.log('onDidOpenTextDocument')
   logger.log(params.document)
   var doc = lspText.TextDocument.create('awda', 'awd', 0, 'meow MEOW')
   logger.log(doc)
   try {
      validateTextDocument(doc)

   } catch(e) {
      logger.log('darns')
   }
})

connection.onNotification((method) => {
   logger.log('notification: ' + method)
})

connection.onExit(() => {
   logger.log('exited')
})
connection.onRequest((method) => {
   logger.log('on request' + method)
})

connection.console.log('hello?')


async function validateTextDocument(textDocument: lspText.TextDocument): Promise<void> {
   // In this simple example we get the settings for every validate run.
   try {

   
   logger.log('before settings')
   // let settings = await getDocumentSettings(textDocument.uri);
   var settings = defaultSettings
   logger.log('after')
   // The validator creates diagnostics for all uppercase words length 2 and more
   let text = textDocument.getText();
   let pattern = /\b[A-Z]{2,}\b/g;
   let m: RegExpExecArray | null;
 
   let problems = 0;
   let diagnostics: Diagnostic[] = [];
   while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
     problems++;
     let diagnostic: Diagnostic = {
       severity: DiagnosticSeverity.Warning,
       range: {
         start: textDocument.positionAt(m.index),
         end: textDocument.positionAt(m.index + m[0].length)
       },
       message: `${m[0]} is all uppercase.`,
       source: 'ex'
     };
     
       diagnostic.relatedInformation = [
         {
           location: {
             uri: textDocument.uri,
             range: Object.assign({}, diagnostic.range)
           },
           message: 'Spelling matters'
         },
         {
           location: {
             uri: textDocument.uri,
             range: Object.assign({}, diagnostic.range)
           },
           message: 'Particularly for names'
         }
       ];
     diagnostics.push(diagnostic);
   }

 
   // Send the computed diagnostics to VS Code.
   logger.log('send diags')
   logger.log(diagnostics)
   connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
} catch(e) {
   
   connection.console.log(e)
   // logger.log(e)
}
 }


 function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
   // console.log('hello', documentSettings)
   // let result = documentSettings.get(resource);
   // if (!result) {
      try {
         var result = connection.workspace.getConfiguration({
           scopeUri: resource,
           section: 'languageServerExample'
         });
         documentSettings.set(resource, result);
         return result;

      } catch(e) {
         connection.console.log('failed')
      }
   // }
 }

//  var doc = lspText.TextDocument.create('awda', 'awd', 0, 'meow MEOW')
//  validateTextDocument(doc)

// connection.onInitialize(initParams => {
//    logger.log('init request')
//    // console.log('initializing?', initParams)
// })
// connection.onInitialized(function() {
//    logger.log('help')
// })
// let notification = lsp.InitializeRequest
// connection.onNotification(notification, function(method){
//    try {
//       logger.log('on Notification: ')
//       logger.log(arguments)
//    } catch(e) {
//       logger.log(e)
//    }
// })





// console.log(lsp)
// const { TextDocument } = require('')

// let connection = rpc.createMessageConnection(
//    new rpc.StreamMessageReader(process.stdin),
//    new rpc.StreamMessageWriter(process.stdout));


// connection.onNotification(notification, (param) => {
   //    // reply back to client
   // });
// let notification = new rpc.NotificationType('hello_world');
// connection.sendNotification(notification, 'hello world!');

// connection.listen();