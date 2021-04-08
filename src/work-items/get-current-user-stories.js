const createGetCurrentStoryIdsGetter = require('./get-current-user-story-ids')

/**
 * Creates a function that gets current user stories from Azure DevOps.
 * @param {AzureDevopsClientOptions} options - Options for accessing Azure DevOps data.
 * @param {fetch} fetch - Interface that fetches resources from the network.
 */
function createGetCurrentUserStoriesGetter ({ organization, project }, fetch) {
  if (organization === undefined) {
    throw new TypeError('The "options.organization" property is not defined.')
  }

  if (project === undefined) {
    throw new TypeError('The "options.project" property is not defined.')
  }

  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined.')
  }

  const getCurrentStoryIds = createGetCurrentStoryIdsGetter({ organization, project }, fetch)

  return getCurrentUserStories

  /**
   * Gets the user stories that were current at the specified date and for the states and area path specified.
   * @param {object} storyOptions - Options for getting user stories.
   * @param {string[]} storyOptions.activeStates - The states to check for active user stories.
   * @param {string} storyOptions.areaPath - The area path under which the user stories are categorized.
   * @param {Date} storyOptions.referenceDate - The reference date at which the current (at the time) user stories are required.
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

    const ids = await getCurrentStoryIds({ activeStates, areaPath, referenceDate })
    return ids
  }
}

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevopsClientOptions} AzureDevopsClientOptions
 * @typedef {import('../api/create-azure-devops-client').fetch} fetch
 * @typedef {import('./get-current-user-story-ids').UserStoryOptions} UserStoryOptions
 */

module.exports = createGetCurrentUserStoriesGetter
