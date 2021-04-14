const createGetCurrentStoryIdsGetter = require('./get-current-user-story-ids')
const createGetCompleteUserStoriesGetter = require('./get-complete-user-stories')
const validateOptions = require('../api/validate-options')

/**
 * Creates a function that gets current user stories from Azure DevOps.
 * @param {AzureDevopsClientOptions} options - Options for accessing Azure DevOps data.
 * @returns {getCurrentUserStories}
 */
function createGetCurrentUserStoriesGetter (options) {
  options = validateOptions(options)
  const getCurrentStoryIds = createGetCurrentStoryIdsGetter(options)
  const getCompleteUserStories = createGetCompleteUserStoriesGetter(options)

  return getCurrentUserStories

  /**
   * Gets the user stories that were current at the specified date and for the states and area path specified.
   * @param {object} storyOptions - Options for getting user stories.
   * @param {string[]} storyOptions.activeStates - The states to check for active user stories.
   * @param {string} storyOptions.areaPath - The area path under which the user stories are categorized.
   * @param {Date} storyOptions.referenceDate - The reference date at which the current (at the time) user stories are required.
   * @returns {Promise<UserStoriesResult>} A promise that resolves in an array of user stories and the reference date at which they were current.
   */
  async function getCurrentUserStories ({ activeStates, areaPath, referenceDate }) {
    if (areaPath === undefined) {
      throw new TypeError('The "storyOptions.areaPath" is not defined.')
    }

    if (areaPath === '') {
      throw new TypeError('The "storyOptions.areaPath" property must not be empty.')
    }

    if (referenceDate === undefined) {
      throw new TypeError('The "storyOptions.referenceDate" property is not defined.')
    }

    if (Number.isNaN(referenceDate.valueOf())) {
      throw new TypeError('The "storyOptions.referenceDate" property is not a valid date.')
    }

    const idsResult = await getCurrentStoryIds({ activeStates, areaPath, referenceDate })
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
 * @typedef {import('./get-complete-user-stories').UserStory} UserStory
 */

/**
 * Result of a a query on current user stories.
 * @typedef {object} UserStoriesResult
 * @property {Date} referenceDate - The reference date at which the user stories were current.
 * @property {UserStory[]} stories - The user stories returned by the query.
 */

module.exports = createGetCurrentUserStoriesGetter
