import { CONFIG } from "./services/configService";
const fs = require('fs');
// built-in 'readline' module to interact with the command line
const readline = require('readline');


const sourceDir = CONFIG.root;
const allRepos = fs. readdirSync(sourceDir)

console.log(allRepos)


// Create interface for reading input and writing output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to handle user input
function handleInput(input:string) {
    // Handle different commands
    switch (input.trim()) {
        case 'hello':
            console.log('Hello!');
            break;
        case 'time':
            console.log(new Date().toLocaleTimeString());
            break;
        case 'exit':
            console.log('Exiting...');
            rl.close(); // Close the readline interface
            break;
        default:
            console.log('Unknown command. Available commands: hello, time, exit');
    }

    // Prompt for next command
    rl.prompt();
}

// Set up event listener for user input
rl.on('line', handleInput);

// Display initial prompt
console.log('CLI app started. Available commands: hello, time, exit');
rl.prompt();

// Event listener for closing the readline interface
rl.on('close', () => {
    console.log('CLI app closed.');
    process.exit(); // Terminate the Node.js process
});

// Display initial prompt
console.log('CLI app started. Available commands: hello, time, exit');
rl.prompt();
