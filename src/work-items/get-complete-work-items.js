/**
 * Creates a function that gets complete work items for the specified ids.
 * @param {GetWorkItemDetails} getWorkItemDetails Function that gets work item details for the specified ids.
 * @param {GetWorkItemComments} getWorkItemComments Function that gets comments for a work item.
 * @returns {getCompleteWorkItems} A function that gets complete work items for the specified ids.
 */
function createCompleteWorkItemsGetter (getWorkItemDetails, getWorkItemComments) {
  if (getWorkItemDetails === undefined) {
    throw new TypeError('"getWorkItemDetails" is not defined.')
  }

  if (typeof getWorkItemDetails !== 'function') {
    throw new TypeError('"getWorkItemDetails" is not a function.')
  }

  if (getWorkItemComments === undefined) {
    throw new TypeError('"getWorkItemComments" is not defined.')
  }

  if (typeof getWorkItemComments !== 'function') {
    throw new TypeError('"getWorkItemComments" is not a function.')
  }

  return getCompleteWorkItems

  /**
   * Gets complete work items from Azure DevOps for the specified ids.
   * @param {number[]} ids - Ids of work items to get.
   * @returns {Promise<WorkItem[]>} A promise that resolves in an array of work items.
   */
  async function getCompleteWorkItems (ids) {
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

    const details = await getWorkItemDetails(ids)
    const promisesToAddComments = details.map(getAndAddCommentsForWorkItem)
    return await Promise.all(promisesToAddComments)

    /**
     * Maps a work item to a promise to return it with its comments.
     * @param {WorkItem} workItem - Work item for which we want to get its comments.
     * @returns {Promise<WorkItem>} A promise to return the work item with its comments.
     */
    async function getAndAddCommentsForWorkItem (workItem) {
      const comments = await getWorkItemComments(workItem.id)
      return { ...workItem, comments: comments }
    }
  }
}

/**
 * @typedef {import('./map-to-work-item').WorkItem} WorkItem
 * @typedef {import('./map-to-comment').Comment} Comment
 * @typedef {import('./get-work-item-comments').GetWorkItemComments} GetWorkItemComments
 * @typedef {import('./get-work-item-details').GetWorkItemDetails} GetWorkItemDetails
 * @typedef {function(number[]):Promise<WorkItem[]>} GetCompleteWorkItems
 */

module.exports = createCompleteWorkItemsGetter
