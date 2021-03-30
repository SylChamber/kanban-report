const mapToUserStory = require('./map-to-user-story')

/**
 * Creates a function that gets user story details from Azure DevOps.
 * @param {{organization:string, project: string, [url]:string}} options - Options for Azure DevOps.
 * @param {import('../api/create-azure-devops-client').fetch} fetch - Interface that fetches resources from the network.
 * @returns {getStoryDetails} A function that gets user story details for the specified ids.
 */
function createUserStoryDetailsGetter ({ organization, project, url }, fetch) {
  if (organization === undefined) {
    throw new TypeError('The "organization" property of the options is not defined')
  }

  if (project === undefined) {
    throw new TypeError('The "project" property of the options is not defined')
  }

  if (url === undefined || url === '') {
    url = 'https://dev.azure.com'
  }

  if (fetch === undefined) {
    throw new ReferenceError('"fetch" is not defined')
  }

  return getStoryDetails

  /**
   * Gets the details of user stories from Azure DevOps.
   * @param {number[]} ids - Ids of user stories to get details for.
   * @returns {Promise<UserStory[]>} A promise that resolves in an array of user stories.
   */
  async function getStoryDetails (ids) {
    if (ids === undefined) {
      throw new ReferenceError('"ids" is not defined')
    }

    if (!(ids instanceof Array)) {
      throw new TypeError('"ids" must be an array')
    }

    if (ids.length === 0) {
      throw new TypeError('"ids" must not be empty')
    }

    if (ids.some(id => !Number.isInteger(id))) {
      const nonInt = ids.filter(id => !Number.isInteger(id)).map(id => `"${id}"`).join(', ')
      throw new TypeError(`all items in "ids" must be integers: ${nonInt}`)
    }

    const urlIds = `${url}/${organization}/${project}/_apis/wit/workitemsbatch`
    const query = {
      $expand: 'All',
      ids: ids
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(query)
    }

    /**
     * @type {{json:function():Promise<{count:number, value:object[]}>}}
     */
    const response = await fetch(urlIds, options)

    /**
     * @type {{count:number, value:{id:number, fields:object, url:string}[]}}
     */
    const result = await response.json()
    return result.value.map(mapToUserStory)
  }
}

/**
 * Represents a user story in Azure DevOps.
 * @typedef {import('./map-to-user-story').UserStory[]} UserStory
 */

module.exports = createUserStoryDetailsGetter
