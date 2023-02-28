var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as rpc from 'vscode-jsonrpc/node.js';
import { TextLogger } from './logger.js';
var logger = new TextLogger('./src/.log');
logger.clear();
logger.log('server: starting...');
import * as lsp from 'vscode-languageserver/node.js';
import * as lspText from 'vscode-languageserver-textdocument';
import { DiagnosticSeverity, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver/node.js';
var documents = new TextDocuments(lspText.TextDocument);
var defaultSettings = { maxNumberOfProblems: 1000 };
var globalSettings = defaultSettings;
// Cache the settings of all open documents
var documentSettings = new Map();
logger.log('connection made');
var connection = lsp.createConnection(new rpc.StreamMessageReader(process.stdin), new rpc.StreamMessageWriter(process.stdout));
// var texts = new lsp.TextDocuments(lspText.TextDocument)
logger.log('demo!');
connection.listen();
connection.onInitialize(function (params) {
    logger.log('onInitialize');
    logger.log(params);
    var result = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Full,
            completionProvider: {
                resolveProvider: true
            }
        }
    };
    logger.log('returning result');
    return result;
});
connection.onInitialized(function () {
    connection.console.log('initialized?');
    logger.log('onInitialized-----------');
});
connection.onDidOpenTextDocument(function (params) {
    logger.log('onDidOpenTextDocument');
    logger.log(params.document);
    var doc = lspText.TextDocument.create('awda', 'awd', 0, 'meow MEOW');
    logger.log(doc);
    try {
        validateTextDocument(doc);
    }
    catch (e) {
        logger.log('darns');
    }
});
connection.onNotification(function (method) {
    logger.log('notification: ' + method);
});
connection.onExit(function () {
    logger.log('exited');
});
connection.onRequest(function (method) {
    logger.log('on request' + method);
});
connection.console.log('hello?');
function validateTextDocument(textDocument) {
    return __awaiter(this, void 0, void 0, function () {
        var settings, text, pattern, m, problems, diagnostics, diagnostic;
        return __generator(this, function (_a) {
            // In this simple example we get the settings for every validate run.
            try {
                logger.log('before settings');
                settings = defaultSettings;
                logger.log('after');
                text = textDocument.getText();
                pattern = /\b[A-Z]{2,}\b/g;
                m = void 0;
                problems = 0;
                diagnostics = [];
                while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
                    problems++;
                    diagnostic = {
                        severity: DiagnosticSeverity.Warning,
                        range: {
                            start: textDocument.positionAt(m.index),
                            end: textDocument.positionAt(m.index + m[0].length)
                        },
                        message: "".concat(m[0], " is all uppercase."),
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
                logger.log('send diags');
                logger.log(diagnostics);
                connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: diagnostics });
            }
            catch (e) {
                connection.console.log(e);
                // logger.log(e)
            }
            return [2 /*return*/];
        });
    });
}
function getDocumentSettings(resource) {
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
    }
    catch (e) {
        connection.console.log('failed');
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
