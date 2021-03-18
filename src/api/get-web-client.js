/**
 * Gets a function that returns a web client that allows access to the Azure DevOps REST APIs.
 * @returns {GetWebClient}
 */
export default function getWebClient (azdev) {
  if (azdev === undefined) {
    throw new ReferenceError('"azdev" is not defined')
  }

  if (!Object.keys(azdev).includes('getCoreApi')) {
    throw new TypeError('The "getCoreApi" property is undefined')
  }

  if (!Object.keys(azdev).includes('getWorkItemTrackingApi')) {
    throw new TypeError('The "getWorkItemTrackingApi" property is undefined')
  }

  return function ({ organization, personalAccessToken }) {
    if (organization === undefined || organization === '') {
      throw new TypeError('The "organization" property is undefined')
    }

    if (personalAccessToken === undefined || personalAccessToken === '') {
      throw new TypeError('The "personalAccessToken" property is undefined')
    }

    return {
      async getCoreApi () {},
      async getWorkItemTrackingApi () {}
    }
  }
}

/**
 * @typedef {object} WebApi Client that exposes Azure DevOps REST APIs.
 * @property {function():Promise} getCoreApi - Gets a client for the Core API.
 * @property {function():Promise} getWorkItemTrackingApi - Gets a client for the Work Item Tracking API.
 */

/**
 * Options for getting an Azure DevOps Web API client.
 * @typedef {object} WebApiOptions
 * @property {string} organization - Organization that hosts the data in Azure DevOps.
 * @property {string} personalAccessToken - Personal access token that permits authentication to the Azure DevOps API.
 */

/**
 * Gets a client for getting Azure DevOps REST APIs.
 * @typedef {function(WebApiOptions): WebApi} GetWebClient
 */
