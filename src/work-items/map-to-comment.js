import mapToPerson from '../teams/map-to-person.js'

/**
 * @typedef {import("../teams/map-to-person").Person} Person
 */

/**
 * Represents a work item comment.
 * @typedef Comment
 * @property {number} id - ID of the comment in Azure DevOps.
 * @property {number} workItemId - ID of the work item to which the comment was posted.
 * @property {Person} createdBy - The person who created the comment.
 * @property {Date} createdDate - The creation date of the comment.
 * @property {Person} [modifiedBy] - The personn who modified the comment, if applicable.
 * @property {Date} [modifiedDate] - The date when the comment was modified, if applicable.
 * @property {string} text - Text of the comment.
 * @property {string} url - The URL of the comment in Azure DevOps.
 * @property {number} version - The version number of the comment.
 */

/**
 * Maps a work item comment from Azure DevOps to an object that represents a comment.
 * @param workItemComment - Work item comment in Azure DevOps.
 * @returns {Comment} An object that represents the work item comment.
 */
export default function mapToComment (workItemComment) {
  const comment = {
    id: workItemComment.id,
    workItemId: workItemComment.workItemId,
    createdDate: new Date(workItemComment.createdDate),
    createdBy: mapToPerson(workItemComment.createdBy),
    text: workItemComment.text,
    url: workItemComment.url,
    version: workItemComment.version
  }

  if (workItemComment.modifiedDate) {
    Object.assign(comment, {
      modifiedDate: new Date(workItemComment.modifiedDate)
    })
  }

  if (workItemComment.modifiedBy) {
    Object.assign(comment, {
      modifiedBy: mapToPerson(workItemComment.modifiedBy)
    })
  }

  return comment
}
