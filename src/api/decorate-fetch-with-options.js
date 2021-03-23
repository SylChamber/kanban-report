// using base-64 package so it works both in Node.js and browsers
const base64 = require('base-64')

/**
 * Decorates a fetch function call with Authorization and Accept headers.
 * @param {Fetch} fetch - Interface that fetches resources from the network.
 * @param {string} personalAccessToken - Personal access token that allows access to Azure DevOps.
 * @returns {Fetch} A fetch function decorated to add Authorization and Accept headers to calls.
 */
function decorateFetchWithAuthHeader (fetch, personalAccessToken) {
  if (personalAccessToken === undefined | personalAccessToken === '') {
    throw new ReferenceError('"personalAccessToken" is not defined')
  }

  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined')
  }

  if (typeof fetch !== 'function') {
    throw new ReferenceError('"fetch" is not a function')
  }

  return fetchWithAuth

  /**
   * Fetches a resource from the network while adding an authorization header to all requests.
   * @param {RequestInfo} url - URL for fetching.
   * @param {RequestInit} options - Options for the HTTP request.
   * @returns {Promise<Response>} A promise of an HTTP response.
   */
  async function fetchWithAuth (url, options) {
    if (url === undefined) {
      throw new ReferenceError('"url" is not defined')
    }

    const headersToAdd = {
      Accept: 'application/json',
      Authorization: `Basic ${base64.encode(`:${personalAccessToken}`)}`
    }
    const newOptions = { ...options, headers: { ...options?.headers, ...headersToAdd } }

    fetch(url, newOptions)
  }
}

/**
 * @typedef {import('./create-azure-devops-client').fetch} Fetch
 * @typedef {import('node-fetch').RequestInfo} RequestInfo
 * @typedef {import('node-fetch').RequestInit} RequestInit
 * @typedef {import('node-fetch').Response} Response
 */

module.exports = decorateFetchWithAuthHeader
