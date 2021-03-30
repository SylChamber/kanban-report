const createUserStoryDetailsGetter = require('./get-user-story-details')
const createUserStoryCommentsGetter = require('./get-user-story-comments')

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

  const getUserStoryDetails = createUserStoryDetailsGetter({ organization, project, url }, fetch)
  const getUserStoryComments = createUserStoryCommentsGetter({ organization, project, url }, fetch)

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
 */

module.exports = createCompleteUserStoriesGetter
