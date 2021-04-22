const mapToBoard = require('./map-to-board')
const mapToPerson = require('../teams/map-to-person')

/**
 * Maps a work item in Azure DevOps to a more user-friendly object.
 * @param {DevOpsWorkItem} item - Work item from Azure DevOps to map to a nicely structured work item.
 * @returns {WorkItem} An object that represents the work item in Azure DevOps.
 */
function mapToWorkItem (item) {
  const story = {
    id: item.id,
    areaPath: item.fields[fieldKeys.areaPath],
    createdBy: mapToPerson(item.fields[fieldKeys.createdBy]),
    createdDate: new Date(item.fields[fieldKeys.createdDate]),
    project: item.fields[fieldKeys.teamProject],
    revision: item.rev,
    state: item.fields[fieldKeys.state],
    stateChangeDate: new Date(item.fields[fieldKeys.stateChangeDate]),
    stateReason: item.fields[fieldKeys.stateReason],
    title: item.fields[fieldKeys.title],
    url: item.url,
    workItemType: item.fields[fieldKeys.workItemType]
  }

  if (item.fields[fieldKeys.acceptanceCriteria]) {
    Object.assign(story, {
      acceptanceCriteria: item.fields[fieldKeys.acceptanceCriteria]
    })
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

  if (item.fields[fieldKeys.boardColumn]) {
    Object.assign(story, {
      board: mapToBoard(item)
    })
  }

  if (item.fields[fieldKeys.changedBy]) {
    Object.assign(story, {
      changedBy: mapToPerson(item.fields[fieldKeys.changedBy])
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

  if (item.fields[fieldKeys.description]) {
    Object.assign(story, {
      description: item.fields[fieldKeys.description]
    })
  }

  if (item.fields[fieldKeys.firstActivatedDate]) {
    Object.assign(story, {
      firstActivatedDate: new Date(item.fields[fieldKeys.firstActivatedDate])
    })
  }

  if (item.fields[fieldKeys.parent]) {
    Object.assign(story, {
      parent: item.fields[fieldKeys.parent]
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
  parent: 'System.Parent',
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

/**
 * @typedef {import('../teams/map-to-person').Person} Person
 * @typedef {import('./map-to-board').BoardLocation} BoardLocation
 */

/**
 * @typedef {{id:number, fields:object, rev:number, url:string}} DevOpsWorkItem
 */

/**
 * Represents a work item from Azure DevOps with a user-friendly structure.
 * @typedef {Object} WorkItem
 * @property {number} id - The ID of the work item in Azure DevOps.
 * @property {string} [acceptanceCriteria] - The acceptance criteria of the work item.
 * @property {Person} [activatedBy] - The person who activated the work item, e.g. who began work.
 * @property {Date} [activatedDate] - The date the work item was activated, e.g. when work began.
 * @property {string} areaPath - The area path of the work item, that categorizes the work item.
 * @property {Person} [assignedTo] - The person the work item is assigned to.
 * @property {BoardLocation} [board] - The location of the work item on the board.
 * @property {Person} [changedBy] - The person who last changed the work item.
 * @property {Date} [changedDate] - The date the work item was changed, if applicable.
 * @property {Person} [closedBy] - The person who closed the work item, e.g. marked it as finished.
 * @property {Date} [closedDate] - The date the work item was closed (e.g. finished), if applicable.
 * @property {Person} createdBy - The person that created the work item.
 * @property {Date} createdDate - The date the work item was created.
 * @property {string} [description] - The description of the work item.
 * @property {Date} [firstActivatedDate] - The date the work item was first activated (e.g. work first began).
 * @property {number} [parent] - The parent work item the current work item is attached to as a child.
 * @property {string} project - The Azure DevOps project the work item is in.
 * @property {number} revision - The revision number of the work item in Azure DevOps.
 * @property {string} state - The state of the work item, for example 'New', 'Active', 'Closed'.
 * @property {Date} [stateChangeDate] - The date the state of the work item was changed.
 * @property {string} [stateReason] - The reason for the state change of the story, for example 'Implementation started'.
 * @property {string[]} [tags] - Tags that are associated with the work item.
 * @property {string} title - The title of the work item.
 * @property {string} url - The URL of the work item in the Azure DevOps API.
 * @property {string} workItemType - The type of the work item, for example 'User Story' or 'Task'.
 */

module.exports = mapToWorkItem
