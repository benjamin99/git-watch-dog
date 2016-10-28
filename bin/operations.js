'use strict';

const EOL = require('os').EOL;
const co = require('co');
const _ = require('lodash');
const _exec = require('child_process').exec;
const Promise = require('bluebird');
const records = require('./records');

const exec = Promise.promisify(_exec);

/** utilities */

function lockCommand(file) {
  return `git update-index --assume-unchanged ${file}`;
}

function releaseCommand(file) {
  return `git update-index --no-assume-unchanged ${file}`;
}

function listCommand() {
  return 'git ls-files -v|grep \'^h\'';
}

function *execWithLog(command) {
  try {
    console.log(`action: ${command}`);
    const result = yield exec(command);
    return result;

  } catch (error) {
    throw error;
  }
}

function *lock(file) {
  try {
    yield execWithLog(lockCommand(file));
    yield records.append(file);
    console.log(`finished lock file: ${file}`);

  } catch (error) {
    console.error('ERROR: \n' + error.message || error);
  }
}

function *release(file) {
  try {
    yield execWithLog(releaseCommand(file));
    yield records.remove(file);
    console.log(`finished release file: ${file}`);

  } catch (error) {
    console.error('ERROR: \n' + error.message || error);
  }
}

/** exports */

exports.lock = function(file) {
  console.log(`to lock file: ${file}`);
  co(function*() {
    yield lock(file);
  });
};

exports.release = function(file) {
  console.log(`to release file: ${file}`);

  co(function*() {
    yield release(file);
  });
};

exports.update = function() {
  console.log('update the --assume-unchanged list:');

  co(function*() {
    // load the currently --assume-unchanged list:
    let locked;
    try {
      const result = yield execWithLog(listCommand());
      locked = _.map(result.split(EOL).slice(0, -1), item => item.slice(2));
    } catch (error) {
      console.log('ERROR: ' + error);
    }
    // load the targets from the records:
    const list = yield records.load();

    const toLock = _.without.apply(this, [list].concat(locked));
    const toRelease = _.without.apply(this, [locked].concat(list));

    for (const item of toLock) {
      yield lock(item);
    }

    for (const item of toRelease) {
      yield release(item);
    }
  });
};

exports.list = function() {
  co(function*() {
    const result = yield execWithLog(listCommand());
    console.log('currently --assume-unchanged:');
    for (const item of result.split(EOL).slice(0, -1)) {
      console.log(`- ${item.slice(2)}`);
    }
  });
};
