const mapToPerson = require('./map-to-person')
const validateOptions = require('../api/validate-options')

/**
 * @module api/createTeamMembersGetter
 */

/**
 * Creates a function that gets the members for the specified team.
 * @param {AzureDevOpsOptions} options Options for Azure DevOps REST API calls.
 * @returns {getTeamMembers} Function that gets the members for the specified team.
 */
function createTeamMembersGetter (options) {
  const { organization, project, url, fetch } = validateOptions(options)

  return getTeamMembers

  /**
  * Gets the members for the specified team
  * @param {string} team Team for which the members are required
  * @returns {Promise<Person[]>} Promise of a result of a query for team members.
  * @throws {ReferenceError} "team" is not defined
  */
  async function getTeamMembers (team) {
    if (team === undefined || team === '') {
      throw new ReferenceError('"team" is not defined')
    }

    const teamMembersUrl = `${url}/${organization}/_apis/projects/${project}/teams/${team}/members`
    const mapMemberToPerson = member => mapToPerson(member.identity)
    const response = await fetch(teamMembersUrl)

    /**
     * @type {TeamMembersResult}
     */
    const result = await response.json()
    const persons = result.value.filter(member => !member.identity.isContainer)
    return persons.map(mapMemberToPerson)
  }
}

/**
 * @typedef {import('./map-to-person').Identity} Identity
 * @typedef {import('./map-to-person').Person} Person
 * @typedef {import('../api/create-azure-devops-client').AzureDevOpsOptions} AzureDevOpsOptions
 * @typedef {import('../api/create-azure-devops-client').fetch} fetch
 * @typedef {import('node-fetch').RequestInfo} RequestInfo
 * @typedef {import('node-fetch').RequestInit} RequestInit
 * @typedef {import('node-fetch').Response} Response
 */

/**
 * Object that represents a team member in the Azure DevOps Core API.
 * @typedef {object} TeamMember
 * @property {Identity} identity - Identity of the team member.
 */

/**
 * Results of the API call to get team members.
 * @typedef {Object} TeamMembersResult
 * @property {TeamMember[]} value - Array of team members.
 * @property {number} count - Count of team members.
 */

/**
 * @typedef {function(string):Promise<Person[]>} GetTeamMembers
 */

module.exports = createTeamMembersGetter
