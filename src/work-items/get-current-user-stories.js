/**
 * Creates a function that gets current user stories from Azure DevOps.
 * @param {GetCurrentWorkItemIds} getWorkItemStoryIds Function that gets current user story ids.
 * @param {GetCompleteWorkItems} getCompleteWorkItems Function that gets complete user stories for the specified ids.
 * @returns {getCurrentUserStories}
 */
function createGetCurrentUserStoriesGetter (getWorkItemStoryIds, getCompleteWorkItems) {
  if (getWorkItemStoryIds === undefined) {
    throw new ReferenceError('"getCurrentWorkItemIds" is not defined.')
  }

  if (typeof getWorkItemStoryIds !== 'function') {
    throw new TypeError('"getCurrentWorkItemIds" is not a function.')
  }

  if (getCompleteWorkItems === undefined) {
    throw new ReferenceError('"getCompleteWorkItems" is not defined.')
  }

  if (typeof getCompleteWorkItems !== 'function') {
    throw new TypeError('"getCompleteWorkItems" is not a function.')
  }

  return getCurrentUserStories

  /**
   * Gets the user stories that were current at the specified date and for the states and area path specified.
   * @param {string} team - The team for which current user story ids are required.
   * @param {Date} [referenceDate] - The reference date at which the current (at the time) user stories are required; if not specified, the current date is used.
   * @returns {Promise<UserStoriesResult>} A promise that resolves in an array of user stories and the reference date at which they were current.
   */
  async function getCurrentUserStories (team, referenceDate) {
    if (team === undefined) {
      throw new ReferenceError('"team" is not defined.')
    }

    if (team === '') {
      throw new TypeError('"team" is empty.')
    }

    const idsResult = await getWorkItemStoryIds(team, referenceDate)
    const partialResult = { referenceDate: idsResult.referenceDate }

    if (idsResult.items.length === 0) {
      return { ...partialResult, stories: [] }
    }

    const ids = idsResult.items.map(s => s.id)
    const stories = await getCompleteWorkItems(ids)

    return { ...partialResult, stories }
  }
}

/**
 * @typedef {import('./get-current-work-item-ids').WorkItemReferencesResult} WorkItemReferencesResult
 * @typedef {import('./get-current-work-item-ids').GetCurrentWorkItemIds} GetCurrentWorkItemIds
 * @typedef {import('./get-complete-work-items').WorkItem} WorkItem
 * @typedef {import('./get-complete-work-items').GetCompleteWorkItems} GetCompleteWorkItems
 */

/**
 * Result of a a query on current user stories.
 * @typedef {object} UserStoriesResult
 * @property {Date} referenceDate - The reference date at which the user stories were current.
 * @property {UserStory[]} stories - The user stories returned by the query.
 */

/**
 * @typedef {function(string, Date=):Promise<UserStoriesResult>} GetCurrentUserStories
 */

module.exports = createGetCurrentUserStoriesGetter
