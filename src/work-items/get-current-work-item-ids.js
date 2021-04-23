const validateOptions = require('../api/validate-options')

/**
 * Creates a function that gets current work item Ids from Azure DevOps.
 * @param {AzureDevOpsOptions} options Options for accessing Azure DevOps data.
 * @param {GetTeamSettings} getTeamSettings Function that gets settings for a team.
 * @returns {getCurrentWorkItemIds} A function that gets the current work item ids at the date specified.
 */
function createCurrentWorkItemIdsGetter (options, getTeamSettings) {
  const { organization, project, fetch, url } = validateOptions(options)

  if (getTeamSettings === undefined) {
    throw new TypeError('"getTeamSettings" is not defined.')
  }

  if (typeof getTeamSettings !== 'function') {
    throw new TypeError('"getTeamSettings" is not a function.')
  }

  return getCurrentWorkItemIds

  /**
 * Gets the current work item Ids at the reference date specified in the options,
 * e.g. the active items and the items closed during the reference date.
 * @param {string} team - The team for which current work item ids are required.
 * @param {Date} [referenceDate] - The reference date at which the current (at the time) work items are required; if not specified, the current date is used.
 * @returns {Promise<WorkItemReferencesResult>} A promise that resolves in a result of work item Ids that were current at the specified reference date.
 */
  async function getCurrentWorkItemIds (team, referenceDate) {
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
      items: result.workItems
    }
  }
}

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevOpsOptions} AzureDevOpsOptions
 * @typedef {import('../teams/get-team-settings').TeamSettings} TeamSettings
 * @typedef {import('../teams/get-team-settings').GetTeamSettings} GetTeamSettings
 */

/**
 * @typedef {object} WiqlApiResult
 * @property {string} asOf - Date of reference of the data in ISO format
 * @property {WorkItemReference[]} workItems - Work item references returned by the API.
 */

/**
 * Result of a query on current work item references.
 * @typedef {object} WorkItemReferencesResult
 * @property {Date} referenceDate - The reference date at which the work items were current.
 * @property {WorkItemReference[]} items - The work item references returned by the query.
 */

/**
 * Work item reference with its ID and URL in Azure DevOps.
 * @typedef {object} WorkItemReference
 * @property {number} id - ID of the work item.
 * @property {string} url - URL of the work item in the REST API.
 */

/**
 * @typedef {function(string, string=):Promise<WorkItemReferencesResult>} GetCurrentWorkItemIds
 */

module.exports = createCurrentWorkItemIdsGetter
