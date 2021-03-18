/**
 * Gets a function that returns a web client that allows access to the Azure DevOps REST APIs.
 * @param {AzDevWebApi} webApi - The Azure DevOps Web API that permits access to the APIs.
 * @returns {GetWebClient} A function that returns a web client.
 */
export default function getWebClient (webApi) {
  if (webApi === undefined) {
    throw new ReferenceError('"webApi" is not defined')
  }

  if (webApi.getCoreApi === undefined) {
    throw new TypeError('The "getCoreApi" property is undefined')
  }

  if (webApi.getWorkItemTrackingApi === undefined) {
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
 * @typedef {object} AzDevWebApi Azure DevOps Web API client.
 * @property {function():Promise} getCoreApi - Gets a client for the Core API.
 * @property {function():Promise} getWorkItemTrackingApi - Gets a client for the Work Item Tracking API.
 */

/**
 * @typedef {object} WebClient Client that exposes Azure DevOps REST APIs.
 * @property {function():Promise} getCoreApi - Gets a client for the Core API.
 * @property {function():Promise} getWorkItemTrackingApi - Gets a client for the Work Item Tracking API.
 */

/**
 * @typedef {object} WebClientOptions Options for getting an Azure DevOps Web API client.
 * @property {string} organization - Organization that hosts the data in Azure DevOps.
 * @property {string} personalAccessToken - Personal access token that permits authentication to the Azure DevOps API.
 */

/**
 * Gets a client for getting Azure DevOps REST APIs.
 * @typedef {function(WebClientOptions): WebClient} GetWebClient
 */
