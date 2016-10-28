#!/usr/bin/env node

'use strict';

const program = require('commander');
const operations = require('./bin/operations');

program.version('0.1.0');

program.command('lock <file>')
  .description('to set --assume-unchanged on the specified file')
  .action(operations.lock);

program.command('release <file>')
  .description('to set --no-assume-unchanged on the specified file')
  .action(operations.release);

program.command('update')
  .description('to update the --assume-unchanged list')
  .action(operations.update);

program.command('git-list')
  .description('list the files with --assume-unchanged')
  .action(operations.list);

program.parse(process.argv);
