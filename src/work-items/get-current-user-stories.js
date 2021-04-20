/**
 * Creates a function that gets current user stories from Azure DevOps.
 * @param {GetCurrentUserStoryIds} getCurrentUserStoryIds Function that gets current user story ids.
 * @param {GetCompleteUserStories} getCompleteUserStories Function that gets complete user stories for the specified ids.
 * @returns {getCurrentUserStories}
 */
function createGetCurrentUserStoriesGetter (getCurrentUserStoryIds, getCompleteUserStories) {
  if (getCurrentUserStoryIds === undefined) {
    throw new ReferenceError('"getCurrentUserStoryIds" is not defined.')
  }

  if (typeof getCurrentUserStoryIds !== 'function') {
    throw new TypeError('"getCurrentUserStoryIds" is not a function.')
  }

  if (getCompleteUserStories === undefined) {
    throw new ReferenceError('"getCompleteUserStories" is not defined.')
  }

  if (typeof getCompleteUserStories !== 'function') {
    throw new TypeError('"getCompleteUserStories" is not a function.')
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

    const idsResult = await getCurrentUserStoryIds(team, referenceDate)
    const partialResult = { referenceDate: idsResult.referenceDate }

    if (idsResult.stories.length === 0) {
      return { ...partialResult, stories: [] }
    }

    const ids = idsResult.stories.map(s => s.id)
    const stories = await getCompleteUserStories(ids)

    return { ...partialResult, stories }
  }
}

/**
 * @typedef {import('./get-current-user-story-ids').UserStoryReferencesResult} UserStoryReferencesResult
 * @typedef {import('./get-current-user-story-ids').GetCurrentUserStoryIds} GetCurrentUserStoryIds
 * @typedef {import('./get-complete-user-stories').UserStory} UserStory
 * @typedef {import('./get-complete-user-stories').GetCompleteUserStories} GetCompleteUserStories
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
