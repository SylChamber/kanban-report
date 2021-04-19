const validateOptions = require('../api/validate-options')

/**
 * Creates a function that gets current user story Ids from Azure DevOps.
 * @param {AzureDevopsClientOptions & {getTeamSettings:GetTeamSettings}} options Options for accessing Azure DevOps data.
 * @returns {getCurrentUserStoryIds} A function that gets the current user story ids at the date specified.
 */
function createCurrentUserStoryIdsGetter (options) {
  const { organization, project, fetch, url } = validateOptions(options)

  if (!Object.prototype.hasOwnProperty.call(options, 'getTeamSettings')) {
    throw new TypeError('The "getTeamSettings" property is not defined.')
  }

  const getTeamSettings = options.getTeamSettings

  if (typeof getTeamSettings !== 'function') {
    throw new TypeError('The "getTeamSettings" property is not a function.')
  }

  return getCurrentUserStoryIds

  /**
 * Gets the current user story Ids at the reference date specified in the options,
 * e.g. the active stories and the stories closed during the reference date.
 * @param {string} team - The team for which current user story ids are required.
 * @param {Date} [referenceDate] - The reference date at which the current (at the time) user stories are required; if not specified, the current date is used.
 * @returns {Promise<UserStoryReferencesResult>} A promise that resolves in a result of user story Ids that were current at the specified reference date.
 */
  async function getCurrentUserStoryIds (team, referenceDate) {
    if (team === undefined) {
      throw new ReferenceError('"team" is not defined.')
    }

    if (team === '') {
      throw new TypeError('"team" is empty.')
    }

    const urlWiql = `${url}/${organization}/${project}/_apis/wit/wiql`
    const teamSettings = await getTeamSettings(team)
    const states = teamSettings.inProgressStates.map(s => `'${s}'`).join(', ')
    const areas = teamSettings.areas.map(a => `'${a}'`).join(', ')
    const asOf = referenceDate
      ? ` ASOF '${referenceDate?.toISOString()}'`
      : ''
    const query = `Select Id from WorkItems where [Work Item Type] = 'User Story' and [Area Path] in (${areas}) and (State in (${states}) or (State = 'Closed' and [Closed Date] >= @Today)) order by [Changed Date] DESC${asOf}`
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
 * @typedef {import('../api/create-azure-devops-client').AzureDevopsClientOptions} AzureDevopsClientOptions
 * @typedef {import('../teams/get-team-settings').TeamSettings} TeamSettings
 * @typedef {import('../teams/get-team-settings').GetTeamSettings} GetTeamSettings
 */

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
 * Result of a query on current user story references.
 * @typedef {object} UserStoryReferencesResult
 * @property {Date} referenceDate - The reference date at which the user stories were current.
 * @property {UserStoryReference[]} stories - The user story references returned by the query.
 */

/**
 * User Story reference with its ID and URL in Azure DevOps.
 * @typedef {object} UserStoryReference
 * @property {number} id - ID of the user story.
 * @property {string} url - URL of the user story in the REST API.
 */

/**
 * @typedef {function(string, string=):Promise<UserStoryReferencesResult>} GetCurrentUserStoryIds
 */

module.exports = createCurrentUserStoryIdsGetter
