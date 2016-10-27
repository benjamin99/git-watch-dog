'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');
const yaml = require('yamljs');

const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

const RECORD_FILE = '.watchdog.yml';

exports.append = function*(file) {
  let records;
  try {
    const content = yield readFile(RECORD_FILE, 'utf-8');
    records = yaml.parse(content) || [];
  } catch (error) {
    console.error('error: ' + error);
    records = [];
  }

  records.push(file);
  const result = yaml.stringify(_.uniq(records));
  yield writeFile(RECORD_FILE, result);
};

exports.remove = function*(file) {
  let records;
  try {
    const content = yield readFile(RECORD_FILE, 'utf-8');
    records = yaml.parse(content);
  } catch (error) {
    return;
  }

  records = _.without(records, file);
  const result = yaml.stringify(records);
  yield writeFile(RECORD_FILE, result);
};
