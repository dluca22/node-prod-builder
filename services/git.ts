import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";

// when setting all options in a single object
export class GitController {
  public git: SimpleGit;

  public options: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
 };

  constructor(directory:string){

    this.options.baseDir = directory;
    this.git = simpleGit(this.options);
  }
}