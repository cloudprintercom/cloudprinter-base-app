import { makeCloudPrinterRequest, handleCloudPrinterResponse } from '../../../lib/cloudprinter-api'
import { withApiHandler, sendSuccess } from '../../../lib/api-utils'
import { CLOUDPRINTER_API } from '../../../lib/constants'
import logger from '../../../lib/logger'

/**
 * API route handler for fetching categories from CloudPrinter
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function categoriesHandler(req, res) {
  logger.info('Fetching categories from CloudPrinter API')

  const response = await makeCloudPrinterRequest(
    `${CLOUDPRINTER_API.BASE_URL}${CLOUDPRINTER_API.ENDPOINTS.CATEGORIES}`,
    { method: 'GET' },
    req
  )

  const categoriesData = await handleCloudPrinterResponse(response)

  logger.info('Categories data fetched successfully', {
    count: Array.isArray(categoriesData) ? categoriesData.length : 'unknown'
  })

  sendSuccess(res, categoriesData, 'Categories fetched successfully')
}

// Define validation schema for query parameters
const categoriesParamSchema = {
  type: {
    type: 'string',
    required: false,
    pattern: /^(product|service|material)$/,
    validateMessage: 'type must be one of: product, service, material'
  },
  active: {
    type: 'string',
    required: false,
    pattern: /^(true|false)$/,
    validateMessage: 'active must be true or false'
  },
  limit: {
    type: 'string',
    required: false,
    validate: (value) => {
      const num = parseInt(value, 10)
      return !isNaN(num) && num > 0 && num <= 50
    },
    validateMessage: 'limit must be a number between 1 and 50'
  }
}

// Export the handler wrapped with API utilities
export default withApiHandler(categoriesHandler, {
  allowedMethods: ['GET'],
  requireAuth: true,
  validateParams: categoriesParamSchema,
  context: 'Categories API'
})
