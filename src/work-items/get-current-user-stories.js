const createGetCurrentStoryIdsGetter = require('./get-current-user-story-ids')
const createGetCompleteUserStoriesGetter = require('./get-complete-user-stories')
const validateOptions = require('../api/validate-options')

/**
 * Creates a function that gets current user stories from Azure DevOps.
 * @param {AzureDevopsClientOptions & {getTeamSettings:GetTeamSettings}} options - Options for accessing Azure DevOps data.
 * @returns {getCurrentUserStories}
 */
function createGetCurrentUserStoriesGetter (options) {
  options = validateOptions(options)
  const getCurrentStoryIds = createGetCurrentStoryIdsGetter(options)
  const getCompleteUserStories = createGetCompleteUserStoriesGetter(options)

  return getCurrentUserStories

  /**
   * Gets the user stories that were current at the specified date and for the states and area path specified.
   * @param {string} team - The team for which current user story ids are required.
   * @param {Date} [referenceDate] - The reference date at which the current (at the time) user stories are required; if not specified, the current date is used.
   * @returns {Promise<UserStoriesResult>} A promise that resolves in an array of user stories and the reference date at which they were current.
   */
  async function getCurrentUserStories (team, referenceDate) {
    if (team === undefined) {
      throw new ReferenceError('"team" is not defined.')
    }

    if (team === '') {
      throw new TypeError('"team" is empty.')
    }

    const idsResult = await getCurrentStoryIds(team, referenceDate)
    const partialResult = { referenceDate: idsResult.referenceDate }

    if (idsResult.stories.length === 0) {
      return { ...partialResult, stories: [] }
    }

    const ids = idsResult.stories.map(s => s.id)
    const stories = await getCompleteUserStories(ids)

    return { ...partialResult, stories }
  }
}

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevopsClientOptions} AzureDevopsClientOptions
 * @typedef {import('../api/create-azure-devops-client').fetch} fetch
 * @typedef {import('./get-current-user-story-ids').UserStoryOptions} UserStoryOptions
 * @typedef {import('./get-current-user-story-ids').UserStoryReferencesResult} UserStoryReferencesResult
 * @typedef {import('./get-current-user-story-ids').GetCurrentUserStoryIds} GetCurrentUserStoryIds
 * @typedef {import('./get-complete-user-stories').UserStory} UserStory
 * @typedef {import('../teams/get-team-settings').TeamSettings} TeamSettings
 * @typedef {import('../teams/get-team-settings').GetTeamSettings} GetTeamSettings
 */

/**
 * @typedef {Object} GetCurrentUserStoriesOptions
 * @property {GetTeamSettings} getTeamSettings
 * @property {GetCurrentUserStoryIds} getCurrentUserStoryIds
 * @property 
 */

/**
 * Result of a a query on current user stories.
 * @typedef {object} UserStoriesResult
 * @property {Date} referenceDate - The reference date at which the user stories were current.
 * @property {UserStory[]} stories - The user stories returned by the query.
 */

module.exports = createGetCurrentUserStoriesGetter
