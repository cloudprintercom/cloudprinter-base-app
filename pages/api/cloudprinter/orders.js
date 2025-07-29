import { makeCloudPrinterRequest, handleCloudPrinterResponse } from '../../../lib/cloudprinter-api'
import { withApiHandler, sendSuccess } from '../../../lib/api-utils'
import { CLOUDPRINTER_API } from '../../../lib/constants'
import logger from '../../../lib/logger'

/**
 * API route handler for fetching orders from CloudPrinter
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function ordersHandler(req, res) {
  logger.info('Fetching orders from CloudPrinter API')

  const response = await makeCloudPrinterRequest(
    `${CLOUDPRINTER_API.BASE_URL}${CLOUDPRINTER_API.ENDPOINTS.ORDERS}`,
    { method: 'GET' },
    req
  )

  const ordersData = await handleCloudPrinterResponse(response)

  logger.info('Orders data fetched successfully', {
    count: Array.isArray(ordersData) ? ordersData.length : 'unknown'
  })

  sendSuccess(res, ordersData, 'Orders fetched successfully')
}

// Define validation schema for query parameters
const ordersParamSchema = {
  limit: {
    type: 'string',
    required: false,
    validate: (value) => {
      const num = parseInt(value, 10)
      return !isNaN(num) && num > 0 && num <= 100
    },
    validateMessage: 'limit must be a number between 1 and 100'
  },
  offset: {
    type: 'string',
    required: false,
    validate: (value) => {
      const num = parseInt(value, 10)
      return !isNaN(num) && num >= 0
    },
    validateMessage: 'offset must be a non-negative number'
  },
  status: {
    type: 'string',
    required: false,
    pattern: /^(pending|processing|completed|cancelled)$/,
    validateMessage: 'status must be one of: pending, processing, completed, cancelled'
  }
}

// Export the handler wrapped with API utilities
export default withApiHandler(ordersHandler, {
  allowedMethods: ['GET'],
  requireAuth: true,
  validateParams: ordersParamSchema,
  context: 'Orders API'
})
