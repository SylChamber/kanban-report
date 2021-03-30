/**
 * Creates a function that gets complete user stories for the specified ids.
 * @param {{organization:string, project: string, [url]:string}} options - Options for Azure DevOps.
 * @param {import('../api/create-azure-devops-client').fetch} fetch - Interface that fetches resources from the network.
 * @returns {getCompleteUserStories} A function that gets complete user stories for the specified ids.
 */
function createCompleteUserStoriesGetter ({ organization, project, url }, fetch) {
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

  return getCompleteUserStories

  /**
   * Gets complete user stories from Azure DevOps for the specified ids.
   * @param {number[]} ids - Ids of user stories to get.
   * @returns {Promise<UserStory[]>} A promise that resolves in an array of user stories.
   */
  async function getCompleteUserStories (ids) {
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
  }
}

/**
 * Represents a user story in Azure DevOps.
 * @typedef {import('./map-to-user-story').UserStory[]} UserStory
 */

module.exports = createCompleteUserStoriesGetter
