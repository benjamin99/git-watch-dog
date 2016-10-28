'use strict';

const fs = require('fs-extra');
const co = require('co');
const Promise = require('bluebird');

const open = Promise.promisify(fs.open);
const chmod = Promise.promisify(fs.fchmod);

const POST_MERGE_TEMPLATE = `${__dirname}/scripts/post-merge`;
const POST_MERGE_HOOK = './.git/hooks/post-merge';

function *setup() {
  try {
    fs.copySync(POST_MERGE_TEMPLATE, POST_MERGE_HOOK);
    const fd = yield open(POST_MERGE_HOOK, 'a');
    yield chmod(fd, '755');
    console.log('setup successfully!');

  } catch (error) {
    console.error('ERROR: ' + error);
  }
}

exports.setup = function() {
  console.log('add the git post-merge hook ...');
  co(setup);
};
