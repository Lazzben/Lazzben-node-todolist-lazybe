#!/usr/bin/env node
const program = require('commander');
const api = require('./index.js')

program
  .command('add')
  .description('add a task')
  .action((x,list) => {
    const task = list.join(' ')
    api.add(task)
});

program
  .command('clear')
  .description('clear taskList')
  .action(() => {
    api.clear()
});

program.parse(process.argv);

if(process.argv.length === 2){
  api.showAll()
}