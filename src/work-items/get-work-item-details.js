const validateOptions = require('../api/validate-options')
const mapToWorkItem = require('./map-to-work-item')

/**
 * Creates a function that gets work item details from Azure DevOps.
 * @param {AzureDevOpsOptions} options - Options for Azure DevOps REST API calls.
 * @returns {getWorkItemDetails} A function that gets work item details for the specified ids.
 */
function createWorkItemDetailsGetter (options) {
  const { organization, project, url, fetch } = validateOptions(options)

  return getWorkItemDetails

  /**
   * Gets the details of user stories from Azure DevOps.
   * @param {number[]} ids - Ids of user stories to get details for.
   * @returns {Promise<WorkItem[]>} A promise that resolves in an array of user stories.
   */
  async function getWorkItemDetails (ids) {
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
      body: JSON.stringify(query),
      headers: { 'Content-Type': 'application/json' }
    }

    /**
     * @type {{json:function():Promise<{count:number, value:object[]}>}}
     */
    const response = await fetch(urlIds, options)

    /**
     * @type {{count:number, value:{id:number, fields:object, url:string}[]}}
     */
    const result = await response.json()
    return result.value.map(mapToWorkItem)
  }
}

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevOpsOptions} AzureDevOpsOptions
 * @typedef {import('./map-to-work-item').WorkItem} WorkItem Represents a work item in Azure DevOps.
 * @typedef {function(number[]):Promise<WorkItem[]>} GetWorkItemDetails Gets the details of work items from Azure DevOps.
 */

module.exports = createWorkItemDetailsGetter
