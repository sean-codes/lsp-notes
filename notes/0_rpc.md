# RPC
Up to this point I believe I've only known how to transfer data between applications using sockets, databases, or file read/writes.

I guess I never considered another way!


# RPC - Remote procedure call
Seems to be the most basic form of conversing between applications. Client and server but without sockets.

This works by the client application running the server as a child process. Then the client/server communicate between each other using standard input/output!

> child process: https://nodejs.org/api/child_process.html

# Example
server.js
```js
console.log('hello world')
```

client.js
```js
// https://nodejs.org/api/child_process.html
import * as cp from 'child_process'

//-----------------------------------------------------------
// start up server
//-----------------------------------------------------------
// spawn takes a function "node" and arguments as an array
var pathToServer = './examples/0_rpc/server.js'
var server = cp.spawn('node', [ pathToServer ])

//-----------------------------------------------------------
// listen for standard in/out
//-----------------------------------------------------------
// normal
server.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

// error
server.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

// close
server.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})


```


# References
https://www.jsonrpc.org/
https://en.wikipedia.org/wiki/Remote_procedure_call
node / go project https://blog.logrocket.com/introduction-to-rpc-using-go-and-node/
lsp https://github.com/microsoft/vscode-languageserver-node/tree/main/jsonrpc
