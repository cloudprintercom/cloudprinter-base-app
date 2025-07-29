/**
 * Application constants and configuration
 */

const CLOUDPRINTER_API = {
  BASE_URL: process.env.CLOUDPRINTER_BASE_URL,
  ENDPOINTS: {
    USER_INFO: '/clouduser/2.0/info',
    ORDERS: '/cloudapps/2.0/orders',
    CATEGORIES: '/cloudapps/2.0/categories'
  },
  OAUTH: {
    AUTHORIZE_URL: `${process.env.CLOUDPRINTER_BASE_URL}/cloudauth/2.0/oauth2/authorize`,
    TOKEN_URL: `${process.env.CLOUDPRINTER_BASE_URL}/cloudauth/2.0/oauth2/token`,
    REVOKE_URL: `${process.env.CLOUDPRINTER_BASE_URL}/cloudauth/2.0/oauth2/revoke`
  }
}

const ERROR_MESSAGES = {
  TOKEN_REFRESH_FAILED: 'Token refresh failed - please sign in again',
  AUTHENTICATION_FAILED: 'Authentication failed - please sign in again',
  NO_SESSION: 'No valid session or access token',
  API_REQUEST_FAILED: 'API request failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  AUTHENTICATION_REQUIRED: 'Authentication required'
}

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
}


module.exports = {
  CLOUDPRINTER_API,
  ERROR_MESSAGES,
  HTTP_STATUS
}
