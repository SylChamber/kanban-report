const validateOptions = require('../api/validate-options')

/**
 * Creates a function that gets settings for a team.
 * @param {AzureDevopsClientOptions} options - Options for Azure DevOps REST API calls.
 * @returns {getTeamSettings} A function that gets settings for a team.
 */
function createGetTeamSettingsGetter (options) {
  const { organization, project, url, fetch } = validateOptions(options)

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

    const backlogConfigUrl = `${url}/${organization}/${project}/${team}/_apis/work/backlogconfiguration`
    const teamFieldValuesUrl = `${url}/${organization}/${project}/${team}/_apis/work/teamsettings/teamfieldvalues`
    /**
     * @type {{json:function():Promise<BacklogConfiguration>}}
     */
    const backlogConfigResponse = await fetch(backlogConfigUrl)
    const backlogConfig = await backlogConfigResponse.json()
    /**
     * @param {MappedState} mapping
     * @returns {boolean}
     */
    const isUserStoryMap = mapping => mapping.workItemTypeName === 'User Story'
    /**
     * @type {[state:string, category:string][]}
     */
    const stateEntries = Object.entries(backlogConfig.workItemTypeMappedStates.filter(isUserStoryMap)[0].states)
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

    const teamFieldValuesResponse = await fetch(teamFieldValuesUrl)
    /**
     * @type {TeamFieldValues}
     */
    const teamFieldValues = await teamFieldValuesResponse.json()
    /**
     * @param {{value:string}} teamFieldValue
     * @returns {string}
     */
    const toArea = teamFieldValue => teamFieldValue.value
    /**
     * @type {string[]}
     */
    const areas = teamFieldValues.values.map(toArea)

    return { areas, inProgressStates }
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
 * @typedef {object} TeamFieldValues
 * @property {string} defaultValue
 * @property {{value:string}[]} values
 */

/**
 * @typedef {object} TeamSettings Settings for a team for helping to retrieve current user stories.
 * @property {string[]} inProgressStates - States of the team that are in the "in progress" category and which represent work in progress.
 * @property {string[]} areas - area paths for the work items of the team.
 */

/**
 * @typedef {function(string):Promise<TeamSettings>} GetTeamSettings
 */

module.exports = createGetTeamSettingsGetter
