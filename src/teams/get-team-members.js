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
    const members = await client.getTeamMembersWithExtendedProperties(project, team)
    return members
  }
}

export { getTeamMembers }
