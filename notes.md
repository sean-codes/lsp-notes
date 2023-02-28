# JSON RPC / LSP Notes

# JSON RPC
Up to this point I believe I've only known how to transfer data between applications using sockets, databases, or file read/writes.

I guess I never considered another way!


# RPC - Remote procedure call
Seems to be the most basic form of conversing between applications? Client and server but without sockets?


# Example
server 
```js
console.log('hello world')
```

client
```js
const { spawn } = require('node:child_process');
const ls = spawn('node', ['./_server.js']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```


# References
https://www.jsonrpc.org/
https://en.wikipedia.org/wiki/Remote_procedure_call
node / go project https://blog.logrocket.com/introduction-to-rpc-using-go-and-node/
lsp https://github.com/microsoft/vscode-languageserver-node/tree/main/jsonrpc
