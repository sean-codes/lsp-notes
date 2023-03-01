//-----------------------------------------------------------------------
// Simplified validateTextDocument from vscode lsp tutorial.
//
// How to use
//
// Create a text document then validate!
//
// var textDocument = lsp.TextDocument.create('uri', 'languageId', 0, 'this is a TEST')
// var diagnostics = validateTextDocument(textDocument)
//-----------------------------------------------------------------------
import * as lsp from 'vscode-languageserver'


const DEFAULT_SETTINGS = { 
  maxNumberOfProblems: 1000 
}


export function validateTextDocument(textDocument) {
  // In this simple example we get the settings for every validate run.
  var settings = DEFAULT_SETTINGS
  let text = textDocument.getText()

  // The validator creates diagnostics for all uppercase words length 2 and more
  let problems = 0
  let diagnostics = []
  let pattern = /\b[A-Z]{2,}\b/g // matches uppercase? 

  let match
  while ((match = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
    problems += 1
    let diagnostic = {
      source: 'ex',
      message: `${match[0]} is all uppercase.`,
      severity: lsp.DiagnosticSeverity.Warning,
      range: {
        start: textDocument.positionAt(match.index),
        end: textDocument.positionAt(match.index + match[0].length)
      },
    }
   
    diagnostics.push(diagnostic)
  }

  // console.log('validateText diagnostics', JSON.stringify(diagnostics, null, 3))
  return diagnostics
}