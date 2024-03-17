import { cmdExec, cmdHandler } from "./services/cmdHandler";
import { CONFIG } from "./services/configService";
import { GitController } from "./services/git";
const fs = require('fs');

const readline = require('readline');


const sourceDir = CONFIG.source;
const allRepos = fs. readdirSync(sourceDir)

// console.log(allRepos)

// Create interface for reading input and writing output
async function main() {
  const project = await cliInterface('Select project: ', allRepos)
  console.log('progetto selezionato', project, ' !!!!')

  const gtc = new GitController(sourceDir + project)
  let branches = await gtc.git.branchLocal((err, branches) => {
    if (err) {
      console.error('Error:', err);
    } else {
      return branches;
    }})

  const branch = await  cliInterface('Select branch: ', branches.all)
  console.log('branch selezionato', branch, ' !!!!')

  gtc.git.checkout(branch)
  gtc.git.pull('origin', branch, ['--force'])

  const confirmBuild = await cliInterface('Do you want build?? ', ['yes', 'no']);

  if(confirmBuild == 'yes'){
    console.log('Starting build');

    const projPath = `${sourceDir}${project}`

    // Execute a shell command
    let build = await cmdExec("npm run build", projPath)
    if(!build.success){
      console.log('Build failed', build.stderr);
      return;
    } 
    console.log('Build complete: ', build.stdout);

    let zip = await cmdExec(`zip -r ${project}_build.zip dist`, projPath);
    if(!zip.success){
      console.log('zip failed', zip.stderr);
      return;
    }
    console.log('Zip complete: ', zip.stdout);

  }
}

main();

async function cliInterface(msg:string, choices:string[]): Promise<string> {

  return new Promise((resolve) => {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer: (line:string) => {
        const completions = choices;
        const hits = completions.filter((c:string) => c.startsWith(line));
        return [hits.length ? hits : completions, line];
      }
    });
      
    rl.question(msg, (command:string) => {
      rl.close();
      resolve(command);
    });
  })
}