const { getSession } = require('next-auth/react')

/**
 * Makes an authenticated request to CloudPrinter API with automatic token refresh
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {Object} req - The request object from the API route
 * @returns {Promise<Response>} - The fetch response
 */
async function makeCloudPrinterRequest(url, options = {}, req) {
  let session = await getSession({ req })
  console.log(session);

  if (!session || !session.accessToken) {
    throw new Error('No valid session or access token')
  }

  if (session.error === "RefreshAccessTokenError") {
    throw new Error('Token refresh failed - please sign in again')
  }

  const requestOptions = {
    ...options,
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  }

  let response = await fetch(url, requestOptions)

  if (response.status === 401) {
    session = await getSession({ req })

    if (!session || !session.accessToken) {
      throw new Error('Authentication failed - please sign in again')
    }

    if (session.error === "RefreshAccessTokenError") {
      throw new Error('Token refresh failed - please sign in again')
    }

    requestOptions.headers['Authorization'] = `Bearer ${session.accessToken}`
    response = await fetch(url, requestOptions)
  }

  return response
}

/**
 * Helper function to handle CloudPrinter API responses
 * @param {Response} response - The fetch response
 * @returns {Promise<Object>} - The parsed JSON response
 */
async function handleCloudPrinterResponse(response) {
  if (!response.ok) {
    const errorText = await response.text()
    console.error('CloudPrinter API Error:', response.status, errorText)

    const error = new Error('CloudPrinter API request failed')
    error.status = response.status
    error.details = errorText
    throw error
  }

  return await response.json()
}

module.exports = {
  makeCloudPrinterRequest,
  handleCloudPrinterResponse
}
