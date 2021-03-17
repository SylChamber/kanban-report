import mapToBoard from './map-to-board.js'
import mapToPerson from '../teams/map-to-person.js'

/**
 * @typedef {import('../teams/map-to-person').Person} Person
 */

/**
 * @typedef {import('./map-to-board').BoardLocation} BoardLocation
 */

/**
 * Represents a user story in Azure DevOps.
 * @typedef {Object} UserStory
 * @property {number} id - The ID of the user story in Azure DevOps.
 * @property {string} [acceptanceCriteria] - The acceptance criteria of the user story.
 * @property {Person} [activatedBy] - The person who activated the user story, e.g. who began work.
 * @property {Date} [activatedDate] - The date the user story was activated, e.g. when work began.
 * @property {string} areaPath - The area path of the user story, that categorizes the user story.
 * @property {Person} [assignedTo] - The person the user story is assigned to.
 * @property {BoardLocation} board - The location of the user story on the board.
 * @property {Date} [changedDate] - The date the user story was changed, if applicable.
 * @property {Person} [closedBy] - The person who closed the user story, e.g. marked it as finished.
 * @property {Date} [closedDate] - The date the user story was closed (e.g. finished), if applicable.
 * @property {Person} createdBy - The person that created the user story.
 * @property {Date} createdDate - The date the user story was created.
 * @property {string} [description] - The description of the user story.
 * @property {Date} [firstActivatedDate] - The date the user story was first activated (e.g. work first began).
 * @property {string} project - The Azure DevOps project the user story is in.
 * @property {number} revision - The revision number of the user story in Azure DevOps.
 * @property {string} state - The state of the user story, for example 'New', 'Active', 'Closed'.
 * @property {Date} [stateChangeDate] - The date the state of the user story was changed.
 * @property {string} [stateReason] - The reason for the state change of the story, for example 'Implementation started'.
 * @property {string[]} [tags] - Tags that are associated with the user story.
 * @property {string} title - The title of the user story.
 * @property {string} workItemType - The type of the work item; should be 'User Story'.
 */

/**
 * Maps a work item in Azure DevOps to a User Story object.
 * @param {any} item - Work item from Azure DevOps to map to a user story.
 * @returns {UserStory} An object that represents the user story in Azure DevOps.
 */
export default function mapToUserStory (item) {
  const story = {
    id: item.id,
    acceptanceCriteria: item.fields[fieldKeys.acceptanceCriteria],
    areaPath: item.fields[fieldKeys.areaPath],
    board: mapToBoard(item),
    createdBy: mapToPerson(item.fields[fieldKeys.createdBy]),
    createdDate: new Date(item.fields[fieldKeys.createdDate]),
    description: item.fields[fieldKeys.description],
    project: item.fields[fieldKeys.teamProject],
    revision: item.rev,
    state: item.fields[fieldKeys.state],
    stateChangeDate: new Date(item.fields[fieldKeys.stateChangeDate]),
    stateReason: item.fields[fieldKeys.stateReason],
    title: item.fields[fieldKeys.title],
    workItemType: item.fields[fieldKeys.workItemType]
  }

  if (item.fields[fieldKeys.activatedBy]) {
    Object.assign(story, {
      activatedBy: mapToPerson(item.fields[fieldKeys.activatedBy])
    })
  }

  if (item.fields[fieldKeys.activatedDate]) {
    Object.assign(story, {
      activatedDate: new Date(item.fields[fieldKeys.activatedDate])
    })
  }

  if (item.fields[fieldKeys.assignedTo]) {
    Object.assign(story, {
      assignedTo: mapToPerson(item.fields[fieldKeys.assignedTo])
    })
  }

  if (item.fields[fieldKeys.changedDate]) {
    Object.assign(story, {
      changedDate: new Date(item.fields[fieldKeys.changedDate])
    })
  }

  if (item.fields[fieldKeys.closedBy]) {
    Object.assign(story, {
      closedBy: mapToPerson(item.fields[fieldKeys.closedBy])
    })
  }

  if (item.fields[fieldKeys.closedDate]) {
    Object.assign(story, {
      closedDate: new Date(item.fields[fieldKeys.closedDate])
    })
  }

  if (item.fields[fieldKeys.firstActivatedDate]) {
    Object.assign(story, {
      firstActivatedDate: new Date(item.fields[fieldKeys.firstActivatedDate])
    })
  }

  if (item.fields[fieldKeys.tags]) {
    Object.assign(story, {
      tags: item.fields[fieldKeys.tags].split(';').map(trim)
    })
  }

  return story
}

const trim = s => s.trim()

const fieldKeys = {
  acceptanceCriteria: 'Microsoft.VSTS.Common.AcceptanceCriteria',
  activatedBy: 'Microsoft.VSTS.Common.ActivatedBy',
  activatedDate: 'Microsoft.VSTS.Common.ActivatedDate',
  areaPath: 'System.AreaPath',
  assignedTo: 'System.AssignedTo',
  boardColumn: 'System.BoardColumn',
  boardColumnDone: 'System.BoardColumnDone',
  boardLane: 'System.BoardLane',
  changedBy: 'System.ChangedBy',
  changedDate: 'System.ChangedDate',
  closedBy: 'Microsoft.VSTS.Common.ClosedBy',
  closedDate: 'Microsoft.VSTS.Common.ClosedDate',
  createdBy: 'System.CreatedBy',
  createdDate: 'System.CreatedDate',
  description: 'System.Description',
  firstActivatedDate: 'Custom.FirstActivatedDate',
  resolvedBy: 'Microsoft.VSTS.Common.ResolvedBy',
  resolvedDate: 'Microsoft.VSTS.Common.ResolvedDate',
  stackRank: 'Microsoft.VSTS.Common.StackRank',
  state: 'System.State',
  stateChangeDate: 'Microsoft.VSTS.Common.StateChangeDate',
  stateReason: 'System.Reason',
  tags: 'System.Tags',
  teamProject: 'System.TeamProject',
  title: 'System.Title',
  workItemType: 'System.WorkItemType'
}
