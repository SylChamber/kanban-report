const createGetTeamSettingsGetter = require('../teams/get-team-settings')
const createGetTeamMembersGetter = require('../teams/get-team-members')
const createGetCurrentUserStoryIdsGetter = require('../work-items/get-current-user-story-ids')
const createGetUserStoryDetailsGetter = require('../work-items/get-user-story-details')
const createGetUserStoryCommentsGetter = require('../work-items/get-user-story-comments')
const createGetCompleteUserStoriesGetter = require('../work-items/get-complete-user-stories')
const createGetCurrentUserStoriesGetter = require('../work-items/get-current-user-stories')
const decorateFetch = require('./decorate-fetch-with-options')
const nodeFetch = require('node-fetch')
const validateOptions = require('./validate-options')

/**
   * Creates a client for the Azure DevOps REST API.
   * @param {AzureDevopsClientOptions} options Options for getting an Azure DevOps REST API client.
   * @returns {AzureDevopsClient} Client for the Azure DevOps REST API.
   */
function createAzureDevopsClient ({ accessToken, organization, project }) {
  if (accessToken === undefined) {
    throw new TypeError('The "accessToken" property is not defined.')
  }

  const options = validateOptions({
    organization,
    project,
    url: arguments[0].url,
    fetch: decorateFetch(nodeFetch, accessToken)
  })
  const getTeamSettings = createGetTeamSettingsGetter(options)
  const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, getTeamSettings)
  const getUserStoryDetails = createGetUserStoryDetailsGetter(options)
  const getUserStoryComments = createGetUserStoryCommentsGetter(options)
  const getCompleteUserStories = createGetCompleteUserStoriesGetter(getUserStoryDetails, getUserStoryComments)

  return {
    getTeamMembers: createGetTeamMembersGetter(options),
    getCurrentUserStories: createGetCurrentUserStoriesGetter(getCurrentUserStoryIds, getCompleteUserStories)
  }
}

/**
 * @typedef {import('node-fetch').RequestInfo} RequestInfo
 * @typedef {import('node-fetch').RequestInit} RequestInit
 * @typedef {import('node-fetch').Response} Response
 * @typedef {import('../teams/get-team-members').GetTeamMembers} GetTeamMembers
 * @typedef {import('../work-items/get-current-user-story-ids').UserStoryOptions} UserStoryOptions
 * @typedef {import('../work-items/get-current-user-story-ids').UserStoryReference} UserStoryReference
 * @typedef {import('../work-items/map-to-user-story').UserStory} UserStory
 * @typedef {import('../work-items/get-current-user-stories').GetCurrentUserStories} GetCurrentUserStories
 */

/**
 * @typedef fetch Interface that fetches resources from the network.
 * @type {function(RequestInfo, [RequestInit]): Promise<Response>}
 */

/**
 * @typedef {object} AzureDevOpsOptions Options for Azure DevOps REST API calls.
 * @property {string} organization Organization that hosts the data in Azure DevOps.
 * @property {string} project Project the team is part of.
 * @property {fetch} fetch Interface that fetches resources from the network.
 * @property {string} [url] The url for Azure DevOps; the Azure DevOps services URL will be used by default.
 */

/**
 * @typedef {object} AzureDevopsClientOptions Options for getting an Azure DevOps REST API client.
 * @property {string} accessToken Personal access token for accessing Azure DevOps.
 * @property {string} organization Organization that hosts the data in Azure DevOps.
 * @property {string} project Project the team is part of.
 * @property {string} [url] The url for Azure DevOps; the Azure DevOps services URL will be used by default.
*/

/**
 * Gets a client for the Azure DevOps REST API.
 * @typedef {function(AzureDevopsClientOptions): AzureDevopsClient} CreateAzureDevopsClient
 */

/**
 * @typedef {object} AzureDevopsClient Client for the Azure DevOps REST API.
 * @property {GetTeamMembers} getTeamMembers Gets the members for the specified team.
 * @property {GetCurrentUserStories} getCurrentUserStories Gets the current user stories for the specified team at the specified date.
 */

module.exports = createAzureDevopsClient
