/**
 * Shared utilities for API routes
 * Provides consistent validation, error handling, and response patterns
 */

const logger = require('./logger')
const { ERROR_MESSAGES, HTTP_STATUS } = require('./constants')

/**
 * Validate HTTP method against allowed methods
 * @param {string} method - HTTP method from request
 * @param {string[]} allowedMethods - Array of allowed methods
 * @returns {boolean} - True if method is allowed
 */
function validateMethod(method, allowedMethods) {
  return allowedMethods.includes(method)
}

/**
 * Validate request parameters
 * @param {Object} params - Parameters to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
function validateParams(params, schema) {
  const errors = []

  for (const [key, rules] of Object.entries(schema)) {
    const value = params[key]

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`)
      continue
    }

    if (!rules.required && (value === undefined || value === null)) {
      continue
    }

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${key} must be of type ${rules.type}`)
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${key} must be at least ${rules.minLength} characters long`)
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${key} must be no more than ${rules.maxLength} characters long`)
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${key} format is invalid`)
    }

    if (rules.validate && !rules.validate(value)) {
      errors.push(rules.validateMessage || `${key} is invalid`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Handle API errors consistently across all routes
 * @param {Error} error - The error object
 * @param {Object} res - Response object
 * @param {string} context - Context for logging (e.g., 'Profile API', 'Orders API')
 */
function handleApiError(error, res, context = 'API') {
  logger.error(`${context} Error`, {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    status: error.status
  })

  if (error.message.includes('Token refresh failed') ||
      error.message.includes('Authentication failed') ||
      error.message.includes('No valid session')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: ERROR_MESSAGES.AUTHENTICATION_FAILED,
      message: error.message,
      requiresReauth: true
    })
  }

  if (error.status) {
    return res.status(error.status).json({
      error: `Failed to fetch data from CloudPrinter`,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined,
      status: error.status
    })
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
  })
}

/**
 * Send standardized success response
 * @param {Object} res - Response object
 * @param {any} data - Data to send
 * @param {string} message - Optional success message
 * @param {number} status - HTTP status code (default: 200)
 */
function sendSuccess(res, data, message = null, status = HTTP_STATUS.OK) {
  const response = { data }
  if (message) {
    response.message = message
  }

  res.status(status).json(response)
}

/**
 * Send standardized error response
 * @param {Object} res - Response object
 * @param {string} error - Error message
 * @param {number} status - HTTP status code
 * @param {any} details - Optional error details
 */
function sendError(res, error, status = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
  const response = { error }
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details
  }

  res.status(status).json(response)
}

/**
 * Middleware wrapper for API routes with consistent error handling
 * @param {Function} handler - The API route handler
 * @param {Object} options - Options for the wrapper
 * @returns {Function} - Wrapped handler function
 */
function withApiHandler(handler, options = {}) {
  const {
    allowedMethods = ['GET'],
    requireAuth = true,
    validateParams: paramSchema = null,
    context = 'API'
  } = options

  return async (req, res) => {
    try {
      if (!validateMethod(req.method, allowedMethods)) {
        logger.warn(`Invalid method attempted on ${context}`, {
          method: req.method,
          allowed: allowedMethods
        })
        return sendError(res, ERROR_MESSAGES.METHOD_NOT_ALLOWED, HTTP_STATUS.METHOD_NOT_ALLOWED)
      }

      if (paramSchema) {
        const validation = validateParams(req.query, paramSchema)
        if (!validation.isValid) {
          logger.warn(`Parameter validation failed for ${context}`, { errors: validation.errors })
          return sendError(res, 'Invalid parameters', HTTP_STATUS.BAD_REQUEST, validation.errors)
        }
      }

      await handler(req, res)

    } catch (error) {
      handleApiError(error, res, context)
    }
  }
}

/**
 * Rate limiting helper (basic implementation)
 * @param {string} identifier - Unique identifier for rate limiting
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if request is allowed
 */
const rateLimitStore = new Map()

function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs

  let requests = rateLimitStore.get(identifier) || []

  requests = requests.filter(timestamp => timestamp > windowStart)

  if (requests.length >= maxRequests) {
    return false
  }

  requests.push(now)
  rateLimitStore.set(identifier, requests)

  return true
}

module.exports = {
  validateMethod,
  validateParams,
  handleApiError,
  sendSuccess,
  sendError,
  withApiHandler,
  checkRateLimit
}
