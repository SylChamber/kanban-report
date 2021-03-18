import mapToPerson from './map-to-person.js'

/**
 * @typedef {import('./map-to-person').Person} Person
 */

/**
 * @typedef {import('./map-to-person').Identity} Identity
 */

/**
 * Object that represents a team member in the Azure DevOps Core API.
 * @typedef {object} TeamMember
 * @property {Identity} identity - Identity of the team member.
 */

/**
 * Client for the Azure DevOps Core API.
 * @typedef {Object} CoreApi
 * @property {function(string, string):Promise<TeamMembersApiResult>} getTeamMembersWithExtendedProperties - Function that gets team members.
 */

/**
 * Results of the API call to get team members.
 * @typedef {Object} TeamMembersApiResult
 * @property {TeamMember[]} value - Array of team members.
 * @property {number} count - Count of team members.
 */

/**
 * Options for GetTeamMembers.
 * @typedef {object} TeamMembersOptions
 * @property {string} project - Project the team is part of.
 * @property {string} team - Team from which the members are to be returned.
 */

/**
 * Gets the members of a team from Azure DevOps as person objects.
 * @typedef {function(TeamMembersOptions): Promise<Person[]>} GetTeamMembers
 */

/**
 * Gets a function that gets team members from Azure DevOps.
 * @param {CoreApi} client - Core API client from the Azure DevOps REST client library.
 * @returns {GetTeamMembers} A function that gets team members from Azure DevOps.
 */
function getTeamMembers (client) {
  return async function ({ project, team }) {
    const result = await client.getTeamMembersWithExtendedProperties(project, team)
    return result.value.map(member => mapToPerson(member.identity))
  }
}

export { getTeamMembers }
