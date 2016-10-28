'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');
const yaml = require('yamljs');

const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

const RECORD_FILE = '.git-watch-dog.yml';

function *load() {
  const content = yield readFile(RECORD_FILE, 'utf-8');
  return yaml.parse(content) || [];
}

function *dump(records) {
  const content = yaml.stringify(records);
  yield writeFile(RECORD_FILE, content);
}

exports.load = load;

exports.append = function*(file) {
  let records;
  try {
    records = yield load();
  } catch (error) {
    console.error('error: ' + error);
    records = [];
  }

  records.push(file);
  records = _.uniq(records);
  yield dump(records);
};

exports.remove = function*(file) {
  let records;
  try {
    records = yield load();
  } catch (error) {
    return;
  }

  records = _.without(records, file);
  yield dump(records);
};
