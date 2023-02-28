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

