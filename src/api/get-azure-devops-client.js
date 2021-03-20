import getTeamMembersGetter from './get-team-members.js'

/**
 * Gets a function that gets a client for the Azure DevOps REST API.
 * @param {fetch} fetch Interface that fetches resources from the network.
 * @returns {GetAzureDevopsClient} A function that gets a client that permits access to Azure DevOps data.
 * @throws {ReferenceError} "fetch" is not defined
 */
export default function getAzureDevopsClient (fetch) {
  // fetch is injected because it makes it simpler to mock in tests without a mocking framework.
  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined')
  }

  /**
   * Gets a client for the Azure DevOps REST API.
   * @function
   * @param {AzdevClientOptions} options Options for getting an Azure DevOps REST API client.
   * @returns {AzdevClient} Client for the Azure DevOps REST API.
   * @throws {ReferenceError} "options" is not defined
   * @throws {TypeError} The "organization" property is not defined
   * @throws {TypeError} The "project" property is not defined
   * @throws {TypeError} The "personalAccessToken" property is not defined
   */
  const getClient = function (options) {
    if (options === undefined) {
      throw new ReferenceError('"options" is not defined')
    }

    if (options.organization === undefined) {
      throw new TypeError('The "organization" property is not defined')
    }

    if (options.project === undefined) {
      throw new TypeError('The "project" property is not defined')
    }

    if (options.personalAccessToken === undefined) {
      throw new TypeError('The "personalAccessToken" property is not defined')
    }

    return {
      getTeamMembers: getTeamMembersGetter(options, fetch)
    }
  }

  return getClient
}

/**
 * @typedef {import('node-fetch').RequestInfo} RequestInfo
 * @typedef {import('node-fetch').RequestInit} RequestInit
 * @typedef {import('node-fetch').Response} Response
 */

/**
 * @typedef fetch Interface that fetches resources from the network.
 * @type {function(RequestInfo, [RequestInit]): Promise<Response>}
 */

/**
 * @typedef {object} AzdevClientOptions Options for getting an Azure DevOps REST API client.
 * @property {string} organization - Organization that hosts the data in Azure DevOps.
 * @property {string} project - Project the team is part of.
 * @property {string} personalAccessToken - Personal access token that allows access to Azure DevOps.
 */

/**
 * Gets a client for the Azure DevOps REST API.
 * @typedef {function(AzdevClientOptions): AzdevClient} GetAzureDevopsClient
 */

/**
 * @typedef {object} AzdevClient Client for the Azure DevOps REST API.
 * @property {function(string): Promise<Person[]>} getTeamMembers Gets the members for the specified team.
 */
