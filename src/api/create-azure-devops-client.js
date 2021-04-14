const createTeamMembersGetter = require('../teams/get-team-members')
const createGetCurrentUserStoriesGetter = require('../work-items/get-current-user-stories')
const validateOptions = require('./validate-options')

/**
   * Creates a client for the Azure DevOps REST API.
   * @param {AzureDevopsClientOptions} options Options for getting an Azure DevOps REST API client.
   * @returns {AzureDevopsClient} Client for the Azure DevOps REST API.
   */
function createAzureDevopsClient (options) {
  options = validateOptions(options)

  return {
    getTeamMembers: createTeamMembersGetter(options),
    getCurrentUserStories: createGetCurrentUserStoriesGetter(options)
  }
}

/**
 * @typedef {import('node-fetch').RequestInfo} RequestInfo
 * @typedef {import('node-fetch').RequestInit} RequestInit
 * @typedef {import('node-fetch').Response} Response
 * @typedef {import('../work-items/get-current-user-story-ids').UserStoryOptions} UserStoryOptions
 * @typedef {import('../work-items/get-current-user-story-ids').UserStoryReference} UserStoryReference
 * @typedef {import('../work-items/map-to-user-story').UserStory} UserStory
 */

/**
 * @typedef fetch Interface that fetches resources from the network.
 * @type {function(RequestInfo, [RequestInit]): Promise<Response>}
 */

/**
 * @typedef {object} AzureDevopsClientOptions Options for getting an Azure DevOps REST API client.
 * @property {string} organization - Organization that hosts the data in Azure DevOps.
 * @property {string} project - Project the team is part of.
 * @property {fetch} fetch - Interface that fetches resources from the network.
 * @property {string} [url] - The url for Azure DevOps; the Azure DevOps services URL will be used by default.
 */

/**
 * Gets a client for the Azure DevOps REST API.
 * @typedef {function(AzureDevopsClientOptions): AzureDevopsClient} CreateAzureDevopsClient
 */

/**
 * @typedef {object} AzureDevopsClient Client for the Azure DevOps REST API.
 * @property {function(string): Promise<Person[]>} getTeamMembers Gets the members for the specified team.
 */

module.exports = createAzureDevopsClient
