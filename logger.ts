import * as fsd from "fs/promises";
let ts = Date.now();


export async function logger(info: string, ip: string) {
    try {
      const content = 'Sleep Function Called at ' + Math.floor(ts/1000) + ' with/from ' + info + ' ' + ip + '\n';
      console.log(content);
      await fsd.appendFile('/home/ubuntu/log.txt', content);
    } catch (err) {
      console.log(err);
    }
  }
