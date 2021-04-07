/**
 * Creates a function that gets current user story Ids from Azure DevOps.
 * @param {import("../api/create-azure-devops-client").AzureDevopsClientOptions} options Options for accessing Azure DevOps data.
 * @param {import("../api/create-azure-devops-client").fetch} fetch Interface that fetches resources from the network.
 * @returns {getCurrentUserStoryIds} A function that gets the current user story ids at the date specified.
 */
function createCurrentUserStoryIdsGetter (options, fetch) {
  if (options === undefined) {
    throw new ReferenceError('"options" is not defined')
  }

  if (options.organization === undefined || options.organization === '') {
    throw new TypeError('The "options.organization" property is not defined')
  }

  if (options.project === undefined || options.project === '') {
    throw new TypeError('The "options.project" property is not defined')
  }

  if (options.url === undefined || options.url === '') {
    options.url = 'https://dev.azure.com'
  }

  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined')
  }

  return getCurrentUserStoryIds

  /**
 * Gets the current user story Ids at the reference date specified in the options,
 * e.g. the active stories and the stories closed during the reference date.
 * @param {UserStoryOptions} userStoryOptions - Options for getting user stories.
 * @returns {Promise<UserStoriesResult>} A promise that resolves in a result of user story Ids that were current at the specified reference date.
 */
  async function getCurrentUserStoryIds (userStoryOptions) {
    if (userStoryOptions === undefined) {
      throw new ReferenceError('"userStoryOptions" is not defined')
    }

    if (userStoryOptions.activeStates === undefined) {
      throw new TypeError('The "userStoryOptions.activeStates" property is not defined')
    }

    if (userStoryOptions.activeStates.length === 0) {
      throw new TypeError('The "userStoryOptions.activeStates" property must not be empty')
    }

    if (userStoryOptions.areaPath === undefined || userStoryOptions.areaPath === '') {
      throw new TypeError('The "userStoryOptions.areaPath" property is not defined')
    }

    const urlWiql = `${options.url}/${options.organization}/${options.project}/_apis/wit/wiql`
    const states = userStoryOptions.activeStates.map(s => `'${s}'`).join(', ')
    const asOf = userStoryOptions.referenceDate
      ? ` ASOF '${userStoryOptions.referenceDate?.toISOString()}'`
      : ''
    const query = `Select Id from WorkItems where [Work Item Type] = 'User Story' and [Area Path] under '${userStoryOptions.areaPath}' and (State in (${states}) or (State = 'Closed' and [Closed Date] >= @Today - 1)) order by [Changed Date] DESC${asOf}`
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }

    const response = await fetch(urlWiql, fetchOptions)
    /**
     * @type {WiqlApiResult}
     */
    const result = await response.json()

    return {
      referenceDate: new Date(result.asOf),
      stories: result.workItems
    }
  }
}

/**
 * @typedef {object} WiqlApiResult
 * @property {string} asOf - Date of reference of the data in ISO format
 * @property {UserStoryReference[]} workItems - Work item references returned by the API.
 */

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
 * @property {UserStoryReference[]} stories - The user story references returned by the query.
 */

/**
 * User Story reference with its ID and URL in Azure DevOps.
 * @typedef {object} UserStoryReference
 * @property {number} id - ID of the user story.
 * @property {string} url - URL of the user story in the REST API.
 */

module.exports = createCurrentUserStoryIdsGetter
