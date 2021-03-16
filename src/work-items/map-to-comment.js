/**
 * Represents a work item comment.
 * @typedef Comment
 * @property {number} id - ID of the comment in Azure DevOps.
 * @property {number} workItemId - ID of the work item to which the comment was posted.
 */

/**
 * Maps a work item comment from Azure DevOps to an object that represents a comment.
 * @param comment - Work item comment in Azure DevOps.
 * @returns {Comment} An object that represents the work item comment.
 */
export default function mapToComment (comment) {
  return {
    id: comment.id,
    workItemId: comment.workItemId
  }
}
