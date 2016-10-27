'use strict';

exports.lock = function(file) {
  // TODO: perform the action to set git lock:
  console.log(`ready to lock file: ${file}`);
};

exports.release = function(file) {
  // TODO: perform the action to release the git lock
  console.log(`ready to release file: ${file}`);
};
