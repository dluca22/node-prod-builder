import { cmdExec, cmdHandler } from "./services/cmdHandler";
import { CONFIG } from "./services/configService";
import { GitController } from "./services/git";
const fs = require('fs');
import dayjs from 'dayjs';

const readline = require('readline');

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

const sourceDir = CONFIG.source;
const allRepos = fs. readdirSync(sourceDir)

// console.log(allRepos)

// Create interface for reading input and writing output
async function main() {

  console.log(...allRepos.map(r => r + ' | '));

  const project = await cliInterface('Select project: ', allRepos)
  // console.log('progetto selezionato', project, ' !!!!')

  const gc = new GitController(sourceDir + project)
  
  let branches = await gc.git.branchLocal((err, branches) => {
    if (err) {
      console.error('Error:', err);
    } else {
      return branches;
    }})

  const branch = await  cliInterface('Select branch: ', branches.all)
  // console.log('branch selezionato', branch, ' !!!!')

  gc.git.checkout(branch)
  gc.git.pull('origin', branch, ['--force'])

  const confirmBuild = await cliInterface('Do you want build?? ', ['yes', 'no', 'y', 'n']);

  if('yes'.includes(confirmBuild)){
    console.log('Starting build');

    const projPath = `${sourceDir}${project}`

    // // Execute a shell command
    let build = await cmdExec("npm run build", projPath)
    if(!build.success){
      console.log('Build failed', build.stderr);
      return;
    } 
    console.log('Build complete: ', build.stdout);

    let zipName = await makeZip(project, projPath);
    await download(zipName, projPath)
  } else {
    console.log('Byeee')
    process.exit();
  }
}


async function cliInterface(msg:string, choices:string[]): Promise<string> {

  return new Promise((resolve) => {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer: (line:string) => {
        const completions = choices;
        const hits = completions.filter((c:string) => c.startsWith(line.toLowerCase()));
        return [hits.length ? hits : completions, line];
      }
    });
      
    rl.question(msg, (command:string) => {
      rl.close();
      resolve(command);
    });
  })
}


async function makeZip(project:string, targetDir: string): Promise<string> {
  const tmstmp = dayjs().format('YYMMDD-HH:mm');

  const zipName = `${project}_build_${tmstmp}.zip`
  
  let zip = await cmdExec(`zip -r ${zipName} dist`, targetDir);
  if(!zip.success){
    console.log('zip failed', zip.stderr);
    process.exit();
  }
  console.log('Zip complete: ', zip.stdout);
  return zipName;
}

async function download(fileName:string, targetDir:string) {
  
  let download = await cmdExec(`mv ${targetDir}/${fileName} .`);
  if(!download.success){
    console.log('Download failed: ', download.stderr)
    process.exit();
  }
  console.log('File downloaded ', download.stdout);
  return;
}
main();
