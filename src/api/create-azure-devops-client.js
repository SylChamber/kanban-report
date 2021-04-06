const createTeamMembersGetter = require('../teams/get-team-members')
const createCurrentUserStoryIdsGetter = require('../work-items/get-current-user-story-ids')
const createCompleteUserStoriesGetter = require('../work-items/get-complete-user-stories')

/**
 * @module api/createAzureDevopsClientFactory
 */

/**
 * Creates a function that creates a client for the Azure DevOps REST API.
 * @param {fetch} fetch Interface that fetches resources from the network.
 * @returns {CreateAzureDevopsClient} A function that creates a client that permits access to Azure DevOps data.
 * @throws {ReferenceError} "fetch" is not defined
 */
function createAzureDevopsClientFactory (fetch) {
  // fetch is injected because it makes it simpler to mock in tests without a mocking framework.
  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined')
  }

  /**
   * Creates a client for the Azure DevOps REST API.
   * @param {AzureDevopsClientOptions} options Options for getting an Azure DevOps REST API client.
   * @returns {AzureDevopsClient} Client for the Azure DevOps REST API.
   * @throws {ReferenceError} "options" is not defined
   * @throws {TypeError} The "organization" property is not defined
   * @throws {TypeError} The "project" property is not defined
   */
  function createAzureDevopsClient (options) {
    if (options === undefined) {
      throw new ReferenceError('"options" is not defined')
    }

    if (options.organization === undefined) {
      throw new TypeError('The "options.organization" property is not defined')
    }

    if (options.project === undefined) {
      throw new TypeError('The "options.project" property is not defined')
    }

    return {
      getTeamMembers: createTeamMembersGetter(options, fetch),
      getCurrentUserStories
    }

    async function getCurrentUserStories (storyOptions) {
      const getIds = createCurrentUserStoryIdsGetter(options, fetch)
      const getStories = createCompleteUserStoriesGetter(options, fetch)
      const currentStories = await getIds(storyOptions)
      const ids = currentStories.stories.map(s => s.id)
      const stories = await getStories(ids)
      return stories
    }
  }

  return createAzureDevopsClient
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
 * @property {string} [url] - The url for Azure DevOps.
 */

/**
 * Gets a client for the Azure DevOps REST API.
 * @typedef {function(AzureDevopsClientOptions): AzureDevopsClient} CreateAzureDevopsClient
 */

/**
 * @typedef {object} AzureDevopsClient Client for the Azure DevOps REST API.
 * @property {function(string): Promise<Person[]>} getTeamMembers Gets the members for the specified team.
 */

module.exports = createAzureDevopsClientFactory
