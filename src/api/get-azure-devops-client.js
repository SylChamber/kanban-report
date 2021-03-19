// using base-64 package so it works both in Node.js and browsers
import base64 from 'base-64/base64.js'
import mapToPerson from '../teams/map-to-person.js'

/**
 * Gets a function that gets a client for the Azure DevOps REST API.
 * @param {function(RequestInfo, [RequestInit]): Promise<Response>} fetch Interface that fetches resources from the network.
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
      /**
       * Gets the members for the specified team
       * @param {string} team Team for which the members are required
       * @returns {Promise<Person[]>} Promise of a result of a query for team members.
       * @throws {ReferenceError} "team" is not defined
       */
      async getTeamMembers (team) {
        if (team === undefined || team === '') {
          throw new ReferenceError('"team" is not defined')
        }

        const url = `https://dev.azure.com/${options.organization}/_apis/projects/${options.project}/teams/${team}/members`
        const fetchOptions = {
          headers: {
            Authorization: `Basic ${base64.encode(`:${options.personalAccessToken}`)}`,
            'Content-Type': 'application/json'
          }
        }
        const mapMemberToPerson = member => mapToPerson(member.identity)
        const response = await fetch(url, fetchOptions)
        const result = await response.json()
        const persons = result.value.filter(member => !member.identity.isContainer)
        return persons.map(mapMemberToPerson)
      }
    }
  }

  return getClient
}

/**
 * @typedef {import('node-fetch').RequestInfo} RequestInfo
 * @typedef {import('node-fetch').RequestInit} RequestInit
 * @typedef {import('node-fetch').Response} Response
 * @typedef {import('../teams/map-to-person').Person} Person
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

/**
 * Object that represents a team member in the Azure DevOps Core API.
 * @typedef {object} TeamMember
 * @property {Identity} identity - Identity of the team member.
 */

/**
 * Results of the API call to get team members.
 * @typedef {Object} TeamMembersResult
 * @property {TeamMember[]} value - Array of team members.
 * @property {number} count - Count of team members.
 */
