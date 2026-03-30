const chalk = require("chalk");

function timestamp() {
  return chalk.gray(new Date().toLocaleTimeString("en-US", { hour12: false }));
}

const levels = {
  info:  chalk.cyan.bold("INFO "),
  error: chalk.red.bold("ERROR"),
  warn:  chalk.yellow.bold("WARN "),
};

function tag(name) {
  return name ? chalk.magenta(`[${name}]`) : "";
}

const log = {
  info(name, ...args)  { console.log(timestamp(), levels.info,  tag(name), ...args); },
  error(name, ...args) { console.error(timestamp(), levels.error, tag(name), ...args); },
  warn(name, ...args)  { console.warn(timestamp(), levels.warn,  tag(name), ...args); },
};

module.exports = log;
