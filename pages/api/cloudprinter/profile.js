import { makeCloudPrinterRequest, handleCloudPrinterResponse } from '../../../lib/cloudprinter-api'
import { withApiHandler, sendSuccess } from '../../../lib/api-utils'
import { CLOUDPRINTER_API } from '../../../lib/constants'
import logger from '../../../lib/logger'

/**
 * API route handler for fetching user profile from CloudPrinter
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function profileHandler(req, res) {
  logger.info('Fetching user profile from CloudPrinter API')

  // Make request to CloudPrinter API with automatic token refresh
  const response = await makeCloudPrinterRequest(
    `${CLOUDPRINTER_API.BASE_URL}${CLOUDPRINTER_API.ENDPOINTS.USER_INFO}`,
    { method: 'GET' },
    req
  )

  // Handle the response
  const profileData = await handleCloudPrinterResponse(response)

  logger.info('Profile data fetched successfully', {
    userId: profileData?.user?.email || 'unknown'
  })

  // Return the profile data
  sendSuccess(res, profileData, 'Profile fetched successfully')
}

// Export the handler wrapped with API utilities
export default withApiHandler(profileHandler, {
  allowedMethods: ['GET'],
  requireAuth: true,
  context: 'Profile API'
})
