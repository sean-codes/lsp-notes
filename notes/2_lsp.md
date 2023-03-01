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



### Example Initialization




References:
protocol: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#lifeCycleMessages
microsoft lsp: https://microsoft.github.io/language-server-protocol/