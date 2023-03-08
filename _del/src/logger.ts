// Text Logger: How to use
//------------------------------------------------------------------
// var logger = new TextLogger('./src/.log')
// logger.clear()
// logger.log('hello')
// logger.log('hello 4')
//------------------------------------------------------------------
import * as fs from 'fs';

export class TextLogger {
   path: string

   constructor(path = './.log') {
      this.path = path
   }

   clear() {
      fs.writeFileSync(this.path, 'Logger\r\n------------------------------- \r\n', { flag: 'w'})
   }

   log(line) {
      var stamp = Date.now()
      try {
         fs.writeFileSync(this.path, '\r\n' + stamp + " : " + JSON.stringify(line, null, 4), { flag: 'a'})
      } catch(e) {
         fs.writeFileSync(this.path, '\r\nLogger: error writing log', { flag: 'a' })
      }
   }
}

