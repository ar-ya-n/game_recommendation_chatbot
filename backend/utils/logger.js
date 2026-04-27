/**
 * 🎮 Simple logging utility with colored output
 */

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info: (message, ...args) => {
    console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${COLORS.gray}${timestamp()}${COLORS.reset} ${message}`, ...args);
  },
  success: (message, ...args) => {
    console.log(`${COLORS.green}[OK]${COLORS.reset}   ${COLORS.gray}${timestamp()}${COLORS.reset} ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`${COLORS.yellow}[WARN]${COLORS.reset} ${COLORS.gray}${timestamp()}${COLORS.reset} ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`${COLORS.red}[ERR]${COLORS.reset}  ${COLORS.gray}${timestamp()}${COLORS.reset} ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`${COLORS.magenta}[DBG]${COLORS.reset}  ${COLORS.gray}${timestamp()}${COLORS.reset} ${message}`, ...args);
    }
  },
};

module.exports = logger;
