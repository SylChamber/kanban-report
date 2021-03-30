const mapToComment = require('./map-to-comment')

/**
 * Creates a function that gets the comments for a user story from Azure DevOps.
 * @param {{organization:string, project: string, [url]:string}} options - Options for Azure DevOps.
 * @param {import('../api/create-azure-devops-client').fetch} fetch - Interface that fetches resources from the network.
 * @returns {getUserStoryComments} A function that gets comments for the specified user story.
 */
function createUserStoryCommentsGetter ({ organization, project, url }, fetch) {
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

  return getUserStoryComments

  /**
   * Gets the comments for the specified user story from Azure DevOps.
   * @param {number} id - The id of the user story for which the comments are required.
   * @returns {Promise<Comment[]>} A promise that resolves in an array of comments for the user story.
  */
  async function getUserStoryComments (id) {
    if (id === undefined) {
      throw new ReferenceError('"id" is not defined')
    }

    if (!Number.isInteger(id)) {
      throw new TypeError('"id" is not an integer')
    }

    const urlComment = `${url}/${organization}/${project}/_apis/wit/workitems/${id}/comments`
    /**
     * @type {{json:function():Promise<{totalCount:number, count:number, comments:object[]}>}}
     */
    const response = await fetch(urlComment)
    /**
     * @type {{totalCount:number, count:number, comments:{id:number, workItemId:number}[]}}
     */
    const result = await response.json()
    return result.comments.map(mapToComment)
  }
}

/**
 * @typedef {import('./map-to-comment').Comment} Comment
 */

module.exports = createUserStoryCommentsGetter
