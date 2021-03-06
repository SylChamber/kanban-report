const mapToComment = require('./map-to-comment')
const validateOptions = require('../api/validate-options')

/**
 * Creates a function that gets the comments for a work item from Azure DevOps.
 * @param {AzureDevOpsOptions} options - Options for Azure DevOps.
 * @returns {getWorkItemComments} A function that gets comments for the specified work item.
 */
function createWorkItemCommentsGetter (options) {
  const { organization, project, url, fetch } = validateOptions(options)

  return getWorkItemComments

  /**
   * Gets the comments for the specified work item from Azure DevOps.
   * @param {number} id - The id of the work item for which the comments are required.
   * @returns {Promise<Comment[]>} A promise that resolves in an array of comments for the work item.
  */
  async function getWorkItemComments (id) {
    if (id === undefined) {
      throw new ReferenceError('"id" is not defined')
    }

    if (!Number.isInteger(id)) {
      throw new TypeError('"id" is not an integer')
    }

    const urlComment = `${url}/${organization}/${project}/_apis/wit/workitems/${id}/comments?api-version=6.0-preview`
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
 * @typedef {import('../api/create-azure-devops-client').AzureDevOpsOptions} AzureDevOpsOptions
 * @typedef {import('./map-to-comment').Comment} Comment
 * @typedef {function(number):Promise<Comment[]>} GetWorkItemComments Gets the comments for the specified work item from Azure DevOps.
 */

module.exports = createWorkItemCommentsGetter
