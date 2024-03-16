const ENV = process.env.NODE_ENV || 'production';
const path = require("path");
const fs = require('fs');

const yargs = require('yargs');
const argv = yargs
  .option('config', {
    alias: 'c',
    description: 'Custom config file',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

const filename = argv.config || path.resolve(__dirname, `../config/${ENV}.json`);
const rawdata = fs.readFileSync(filename);

const production = (ENV == 'production');
const workerExt = production?'.js' :'.ts';

const CONFIG = {...JSON.parse(rawdata), ...{ workerExt:workerExt, }};

export { CONFIG }