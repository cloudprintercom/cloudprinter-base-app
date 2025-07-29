/**
 * Centralized logging utility for the application
 * Provides consistent logging with different levels and environment-aware output
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

const LOG_LEVEL_NAMES = {
  [LOG_LEVELS.ERROR]: 'ERROR',
  [LOG_LEVELS.WARN]: 'WARN',
  [LOG_LEVELS.INFO]: 'INFO',
  [LOG_LEVELS.DEBUG]: 'DEBUG'
}

class Logger {
  constructor() {
    // Set log level based on environment
    this.logLevel = process.env.NODE_ENV === 'production'
      ? LOG_LEVELS.ERROR
      : LOG_LEVELS.DEBUG
  }

  /**
   * Format log message with timestamp and level
   * @param {string} level - Log level name
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   * @returns {string} Formatted log message
   */
  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level}]`

    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`
    }
    return `${prefix} ${message}`
  }

  /**
   * Log message if current log level allows it
   * @param {number} level - Log level number
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   */
  log(level, message, data = null) {
    if (level <= this.logLevel) {
      const levelName = LOG_LEVEL_NAMES[level]
      const formattedMessage = this.formatMessage(levelName, message, data)

      switch (level) {
        case LOG_LEVELS.ERROR:
          console.error(formattedMessage)
          break
        case LOG_LEVELS.WARN:
          console.warn(formattedMessage)
          break
        case LOG_LEVELS.INFO:
          console.info(formattedMessage)
          break
        case LOG_LEVELS.DEBUG:
          console.log(formattedMessage)
          break
        default:
          console.log(formattedMessage)
      }
    }
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {any} data - Additional error data
   */
  error(message, data = null) {
    this.log(LOG_LEVELS.ERROR, message, data)
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {any} data - Additional warning data
   */
  warn(message, data = null) {
    this.log(LOG_LEVELS.WARN, message, data)
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {any} data - Additional info data
   */
  info(message, data = null) {
    this.log(LOG_LEVELS.INFO, message, data)
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {any} data - Additional debug data
   */
  debug(message, data = null) {
    this.log(LOG_LEVELS.DEBUG, message, data)
  }

  /**
   * Log API request details
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {number} status - Response status
   * @param {number} duration - Request duration in ms
   */
  apiRequest(method, url, status, duration) {
    const message = `API ${method} ${url} - ${status} (${duration}ms)`
    if (status >= 400) {
      this.error(message)
    } else {
      this.info(message)
    }
  }

  /**
   * Log authentication events
   * @param {string} event - Auth event type
   * @param {string} details - Event details
   */
  auth(event, details = null) {
    this.info(`Auth: ${event}`, details)
  }
}

// Create and export singleton instance
const logger = new Logger()

module.exports = logger
module.exports.LOG_LEVELS = LOG_LEVELS
