'use strict';

const co = require('co');
const _exec = require('child_process').exec;
const Promise = require('bluebird');
const records = require('./records');

const exec = Promise.promisify(_exec);

function lockCommand(file) {
  return `git update-index --assume-unchanged ${file}`;
}

function releaseCommand(file) {
  return `git update-index --no-assume-unchanged ${file}`;
}

function *execWithLog(command) {
  try {
    console.log(`exec: ${command}`);
    const result = yield exec(command);
    return result;

  } catch (error) {
    throw error;
  }
}

exports.lock = function(file) {
  console.log(`to lock file: ${file}`);

  co(function*() {
    try {
      yield execWithLog(lockCommand(file));
      yield records.append(file);
      console.log(`finished lock file: ${file}`);

    } catch (error) {
      console.error('ERROR: \n' + error.message || error);
    }
  });
};

exports.release = function(file) {
  console.log(`to release file: ${file}`);

  co(function*() {
    try {
      yield execWithLog(releaseCommand(file));
      yield records.remove(file);
      console.log(`finished release file: ${file}`);

    } catch (error) {
      console.error('ERROR: \n' + error.message || error);
    }
  });
};
