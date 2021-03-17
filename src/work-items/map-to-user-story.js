/**
 * Represents a user story in Azure DevOps.
 * @typedef {Object} UserStory
 * @property {number} id - The ID of the user story in Azure DevOps.
 * @property {string} [acceptanceCriteria] - The acceptance criteria of the user story.
 * @property {Date} [activatedDate] - The date the user story was activated, e.g. when work began.
 * @property {string} areaPath - The area path of the user story, that categorizes the user story.
 * @property {Date} [changedDate] - The date the user story was changed, if applicable.
 * @property {Date} createdDate - The date the user story was created.
 * @property {string} [description] - The description of the user story.
 * @property {string} title - The title of the user story.
 * @property {string} state - The state of the user story, for example 'New', 'Active', 'Closed'.
 * @property {Date} [stateChangedDate] - The date the state of the user story was changed.
 * @property {string} [stateReason] - The reason for the state change of the story, for example 'Implementation started'.
 * @property {string} workItemType - The type of the work item; should be 'User Story'.
 */

/**
 * Maps a work item in Azure DevOps to a User Story object.
 * @param {any} item - Work item from Azure DevOps to map to a user story.
 * @returns {UserStory} An object that represents the user story in Azure DevOps.
 */
export default function mapToUserStory (item) {
  const activatedDateKey = 'Microsoft.VSTS.Common.ActivatedDate'
  const changedDateKey = 'System.ChangedDate'
  const story = {
    id: item.id,
    acceptanceCriteria: item.fields['Microsoft.VSTS.Common.AcceptanceCriteria'],
    areaPath: item.fields['System.AreaPath'],
    createdDate: new Date(item.fields['System.CreatedDate']),
    description: item.fields['System.Description'],
    state: item.fields['System.State'],
    stateChangedDate: new Date(item.fields['Microsoft.VSTS.Common.StateChangeDate']),
    stateReason: item.fields['System.Reason'],
    title: item.fields['System.Title'],
    workItemType: item.fields['System.WorkItemType']
  }

  if (item.fields[activatedDateKey]) {
    Object.assign(story, {
      activatedDate: new Date(item.fields[activatedDateKey])
    })
  }

  if (item.fields[changedDateKey]) {
    Object.assign(story, {
      changedDate: new Date(item.fields[changedDateKey])
    })
  }

  return story
}
