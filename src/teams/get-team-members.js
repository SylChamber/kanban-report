import mapToPerson from './map-to-person.js'

/**
 * @typedef {import('./map-to-person').Person} Person
 */

/**
 * Client for the Azure DevOps Core API.
 * @typedef {Object} CoreApi
 * @property {function} getTeamMembersWithExtendedProperties - Function that gets team members.
 */

/**
 * Gets a function that gets team members from Azure DevOps.
 * @param {CoreApi} client - Core API client from the Azure DevOps REST client library.
 * @returns {Function} A function that gets team members from Azure DevOps.
 */
function getTeamMembers (client) {
  return async function (project, team) {
    const result = await client.getTeamMembersWithExtendedProperties(project, team)
    return result.value.map(member => mapToPerson(member.identity))
  }
}

export { getTeamMembers }
