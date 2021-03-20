// using base-64 package so it works both in Node.js and browsers
import base64 from 'base-64'
import mapToPerson from '../teams/map-to-person.js'

/**
 * Gets a function that gets the members for the specified team.
 * @param {AzdevClientOptions} options Options for getting an Azure DevOps REST API client.
 * @param {fetch} fetch Interface that fetches resources from the network.
 * @returns {getTeamMembers} Function that gets the members for the specified team.
 */
export default function (options, fetch) {
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

    const url = `https://dev.azure.com/${options.organization}/_apis/projects/${options.project}/teams/${team}/members`
    const fetchOptions = {
      headers: {
        Authorization: `Basic ${base64.encode(`:${options.personalAccessToken}`)}`,
        'Content-Type': 'application/json'
      }
    }
    const mapMemberToPerson = member => mapToPerson(member.identity)
    const response = await fetch(url, fetchOptions)
    const result = await response.json()
    const persons = result.value.filter(member => !member.identity.isContainer)
    return persons.map(mapMemberToPerson)
  }
}

/**
 * @typedef {import('../teams/map-to-person').Person} Person
 * @typedef {import('./get-azure-devops-client').AzdevClientOptions} AzdevClientOptions
 * @typedef {import('./get-azure-devops-client').fetch} fetch
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
