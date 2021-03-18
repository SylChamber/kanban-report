/**
 * Gets a function that gets a client for the Azure DevOps REST API.
 * @param {function(RequestInfo, [RequestInit]): Promise<Response>} fetch Interface that fetches resources from the network.
 * @returns {GetAzureDevopsClient} A function that gets a client that permits access to Azure DevOps data.
 */
export default function getAzureDevopsClient (fetch) {
  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined')
  }

  return function (options) {
    if (options === undefined) {
      throw new ReferenceError('"options" is not defined')
    }

    if (options.organization === undefined) {
      throw new TypeError('The "organization" property is not defined')
    }

    if (options.project === undefined) {
      throw new TypeError('The "project" property is not defined')
    }

    return {
      async getTeamMembers (team) {
        if (team === undefined || team === '') {
          throw new ReferenceError('"team" is not defined')
        }

        const url = `https://dev.azure.com/${options.organization}/_apis/projects/${options.project}/teams/${team}/members`
        const fetchOptions = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        const response = await fetch(url, fetchOptions)
        return response
      }
    }
  }
}

/**
 * @typedef {import('node-fetch').RequestInfo} RequestInfo
 * @typedef {import('node-fetch').RequestInit} RequestInit
 * @typedef {import('node-fetch').Response} Response
 */

/**
 * @typedef {object} AzdevClientOptions Options for getting an Azure DevOps REST API client.
 * @property {string} organization - Organization that hosts the data in Azure DevOps.
 * @property {string} project - Project the team is part of.
 */

/**
 * Gets a client for the Azure DevOps REST API.
 * @typedef {function(AzdevClientOptions): AzdevClient} GetAzureDevopsClient
 */

/**
 * @typedef {object} AzdevClient Client for the Azure DevOps REST API.
 * @property {function(string): Promise<TeamMembersResult>} getTeamMembers Gets the members for the specified team.
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
