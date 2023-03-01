// Text Logger: how to use
//------------------------------------------------------------------
// import * as logger from 'logger.js'
// logger.clear()
// logger.log('add a log')

// check root for .log file and open to see!
//------------------------------------------------------------------
import * as fs from 'fs';

const path = './.log'

export function clear() {
   fs.writeFileSync(path, 'Logger\r\n------------------------------- \r\n', { flag: 'w'})
}

export function log(...args) {
   const stamp = Date.now()
   try {
      fs.writeFileSync(path, '\r\n' + stamp + " : " + JSON.stringify(args, null, 3), { flag: 'a'})
   } catch(e) {
      fs.writeFileSync(path, '\r\nLogger: error writing log', { flag: 'a' })
   }
}