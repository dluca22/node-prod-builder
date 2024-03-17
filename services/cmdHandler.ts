const subprocess = require('child_process')

export function cmdHandler(...command): Promise<any> {
  console.log('Command; ', command)

  let p = subprocess.spawn(command[0], command.slice(1));

  return new Promise((resolveFunc) => {
    p.stdout.on('data', (x) => {
      process.stdout.write(x.toString())
    });
    p.stderr.on('data', (e) => {
      process.stderr.write(e.toString())
    });
    p.on('exit', (code) =>{
      resolveFunc(code);
    });
  });
}

import { exec } from 'child_process';

export function cmdExec(cmd: string, directory?:string): Promise<void> {
  let command = directory ? `cd ${directory} && ${cmd}` : cmd ;
  
  console.log('Command: ', command);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        reject(error);
      } else {
        if(stdout){
          console.log(`STDOUT: ${stdout}`);}
        if(stderr){
          console.error(`STDERR: ${stderr}`);
        }
        resolve();
      }
    });
  });
}
