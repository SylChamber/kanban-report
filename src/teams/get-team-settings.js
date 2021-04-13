/**
 * Creates a function that gets settings for a team.
 * @param {AzureDevopsClientOptions} options - Options for Azure DevOps REST API calls.
 * @param {fetch} fetch - Interface that fetches resources from the network.
 * @returns {getTeamSettings} A function that gets settings for a team.
 */
function createGetTeamSettingsGetter ({ organization, project, url }, fetch) {
  if (organization === undefined) {
    throw new TypeError('The "options.organization" property is not defined.')
  }

  if (organization === '') {
    throw new TypeError('The "options.organization" property is empty.')
  }

  if (project === undefined) {
    throw new TypeError('The "options.project" property is not defined.')
  }

  if (project === '') {
    throw new TypeError('The "options.project" property is empty.')
  }

  if (url === undefined || url === '') {
    url = 'https://dev.azure.com'
  }

  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined.')
  }

  return getTeamSettings

  /**
   * Gets the settings for a team.
   * @param {string} team - Name of the team for which settings are required.
   * @returns {Promise<TeamSettings>} Settings for the team.
   */
  async function getTeamSettings (team) {
    if (team === undefined) {
      throw new ReferenceError('"team" is not defined.')
    }

    if (team === '') {
      throw new TypeError('"team" is empty.')
    }

    const settingsUrl = `${url}/${organization}/${project}/${team}/_apis/work/backlogconfiguration`
    /**
     * @type {{json:function():Promise<BacklogConfiguration>}}
     */
    const response = await fetch(settingsUrl)
    const result = await response.json()

    /**
     * @param {MappedState} mapping
     * @returns {boolean}
     */
    const isUserStoryMap = mapping => mapping.workItemTypeName === 'User Story'
    /**
     * @type {[state:string, category:string][]}
     */
    const stateEntries = Object.entries(result.workItemTypeMappedStates.filter(isUserStoryMap)[0].states)
    const isInProgress = ([state, category]) => category === 'InProgress'

    /**
     * @param {MappedState} mappedState
     * @returns {string}
     */
    const toState = ([state, category]) => state

    /**
     * @type {string[]}
     */
    const inProgressStates = stateEntries.filter(isInProgress).map(toState)
    return { inProgressStates }
  }
}

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevopsClientOptions} AzureDevopsClientOptions
 * @typedef {import('../api/create-azure-devops-client').fetch} fetch
 */

/**
 * @typedef {object} MappedState
 * @property {string} workItemTypeName
 * @property {object} states
 */

/**
 * @typedef {object} BacklogConfiguration
 * @property {MappedState[]} workItemTypeMappedStates
 */

/**
 * @typedef {object} TeamSettings Settings for a team for helping to retrieve current user stories.
 * @property {string[]} inProgressStates - States of the team that are in the "in progress" category and which represent work in progress.
 * @property {string[]} areas - area paths for the work items of the team.
 */

module.exports = createGetTeamSettingsGetter
