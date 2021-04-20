/**
 * Creates a function that gets complete user stories for the specified ids.
 * @param {GetUserStoryDetails} getUserStoryDetails Function that gets user story details for the specified ids.
 * @param {GetUserStoryComments} getUserStoryComments Function that gets comments for a user story.
 * @returns {getCompleteUserStories} A function that gets complete user stories for the specified ids.
 */
function createCompleteUserStoriesGetter (getUserStoryDetails, getUserStoryComments) {
  if (getUserStoryDetails === undefined) {
    throw new TypeError('"getUserStoryDetails" is not defined.')
  }

  if (typeof getUserStoryDetails !== 'function') {
    throw new TypeError('"getUserStoryDetails" is not a function.')
  }

  if (getUserStoryComments === undefined) {
    throw new TypeError('"getUserStoryComments" is not defined.')
  }

  if (typeof getUserStoryComments !== 'function') {
    throw new TypeError('"getUserStoryComments" is not a function.')
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

    const details = await getUserStoryDetails(ids)
    const promisesToAddComments = details.map(getAndAddCommentsForUserStory)
    return await Promise.all(promisesToAddComments)

    /**
     * Maps a story to a promise to return it with its comments.
     * @param {UserStory} story - User story for which we want to get its comments.
     * @returns {Promise<UserStory>} A promise to return the user story with its comments.
     */
    async function getAndAddCommentsForUserStory (story) {
      const comments = await getUserStoryComments(story.id)
      return { ...story, comments: comments }
    }
  }
}

/**
 * @typedef {import('./map-to-user-story').UserStory} UserStory
 * @typedef {import('./map-to-comment').Comment} Comment
 * @typedef {import('./get-user-story-comments').GetUserStoryComments} GetUserStoryComments
 * @typedef {import('./get-user-story-details').GetUserStoryDetails} GetUserStoryDetails
 * @typedef {function(number[]):Promise<UserStory[]>} GetCompleteUserStories
 */

module.exports = createCompleteUserStoriesGetter
