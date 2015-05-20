
module.exports = false;

var args = [process.argv[1]];
var argv = process.argv.slice(2);
var debug = false;

argv.forEach(function(arg) {
  var flag = arg.split('=')[0];

  switch (flag) {
    case 'debug':
      debug = true;
      break;
    case '--debug':
    case '--debug-brk':
    case '--expose-gc':
    case '--gc-global':
    case '--harmony':
    case '--harmony-proxies':
    case '--harmony-collections':
    case '--harmony-generators':
    case '--prof':
      args.unshift(arg);
      break;
    default:
      if (0 == arg.indexOf('--trace')) args.unshift(arg);
      else args.push(arg);
      break;
  }
});

// has special args
if (debug || args[0] != process.argv[1]) {
  var spawn = require('child_process').spawn;

  // keep existing v8 args
  args = process.execArgv.concat(args);

  // debug HAS to go first
  if (debug) args.unshift('debug');

  // recreate the process with corrected argument ordering
  var proc = spawn(process.argv[0], args, { stdio: [ 0, 1, 2 ] });

  proc.on('exit', function(code, signal) {
    // ensure the main process exits with the same code
    process.on('exit', function(){
      if (signal) process.kill(process.pid, signal);
      else process.exit(code);
    });
  });

  module.exports = true;
}
