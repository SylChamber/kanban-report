/**
 * Creates a function that gets user stories from Azure DevOps.
 * @param {import("../api/create-azure-devops-client").AzureDevopsClientOptions} options Options for accessing Azure DevOps data.
 * @param {import("../api/create-azure-devops-client").fetch} fetch Interface that fetches resources from the network.
 */
function createGetUserStoriesGetter (options, fetch) {
  if (options === undefined) {
    throw new ReferenceError('"options" is not defined')
  }

  if (options.organization === undefined || options.organization === '') {
    throw new TypeError('The "options.organization" property is not defined')
  }

  if (options.project === undefined || options.project === '') {
    throw new TypeError('The "options.project" property is not defined')
  }

  if (options.personalAccessToken === undefined || options.personalAccessToken === '') {
    throw new TypeError('The "options.personalAccessToken" property is not defined')
  }

  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined')
  }

  return getCurrentUserStories
}

/**
 * Gets the current user stories at the reference date specified in the options,
 * e.g. the active stories and the stories closed during the reference date.
 * @param {UserStoryOptions} userStoryOptions - Options for getting user stories.
 * @returns {Promise<UserStoriesResult>} A promise that resolves in a result of user stories that were current at the specified reference date.
 */
async function getCurrentUserStories (userStoryOptions) {
  if (userStoryOptions === undefined) {
    throw new ReferenceError('"userStoryOptions" is not defined')
  }

  if (userStoryOptions.activeStates === undefined) {
    throw new TypeError('The "userStoryOptions.activeStates" is not defined')
  }

  if (userStoryOptions.activeStates.length === 0) {
    throw new TypeError('The "userStoryOptions.activeStates" must not be empty')
  }

  if (userStoryOptions.areaPath === undefined || userStoryOptions.areaPath === '') {
    throw new TypeError('The "userStoryOptions.areaPath" property is not defined')
  }

  if (userStoryOptions.referenceDate === undefined) {
    userStoryOptions.referenceDate = new Date()
  }

  return new Promise((resolve) => {
    resolve({
      referenceDate: new Date(userStoryOptions.referenceDate)
    })
  })
}

/**
 * Options for getting user stories.
 * @typedef {object} UserStoryOptions
 * @property {string[]} activeStates - The states to check for active user stories.
 * @property {string} areaPath - The area path under which the user stories are categorized.
 * @property {Date} [referenceDate] - The reference date at which the current (at the time) user stories are required.
 */

/**
 * Result of a query on current user stories.
 * @typedef {object} UserStoriesResult
 * @property {Date} referenceDate - The reference date at which the user stories were current.
 */

module.exports = createGetUserStoriesGetter