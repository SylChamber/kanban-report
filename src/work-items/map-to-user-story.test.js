const mapToUserStory = require('./map-to-user-story')

/**
 * @typedef {import('../teams/map-to-person').Person} Person
 */

describe('mapToUserStory', function () {
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

  test('copies id', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory.id).toEqual(workItem.id)
  })

  test('copies work item type', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory.workItemType).toEqual(workItem.fields[fieldKeys.workItemType])
  })

  test('copies title', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory.title).toEqual(workItem.fields[fieldKeys.title])
  })

  test('copies area path', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory.areaPath).toEqual(workItem.fields[fieldKeys.areaPath])
  })

  test('copies state', function () {
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.state]: 'Active'
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.state).toEqual(workItem.fields[fieldKeys.state])
  })

  test('copies state reason', function () {
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.stateReason]: 'Implementation started'
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.stateReason).toEqual(workItem.fields[fieldKeys.stateReason])
  })

  test('copies state change date', function () {
    const stateChangeDate = '2020-02-20T20:20:20Z'
    const expectedDate = new Date(stateChangeDate)
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.stateChangeDate]: stateChangeDate
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.stateChangeDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('copies closed date', function () {
    const closedDate = '2020-12-12T12:12:12Z'
    const expectedDate = new Date(closedDate)
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.closedDate]: closedDate
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.closedDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('ignores closed date if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('closedDate')
  })

  test('copies created by', function () {
    const createdBy = {
      displayName: 'John Doe',
      uniqueName: 'john.doe@example.com'
    }
    const expectedCreatedBy = {
      name: createdBy.displayName,
      email: createdBy.uniqueName
    }
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.createdBy]: createdBy
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.createdBy).toEqual(expectedCreatedBy)
  })

  test('copies description', function () {
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.description]: 'some description'
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.description).toEqual(workItem.fields[fieldKeys.description])
  })

  test('copies acceptance criteria', function () {
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.acceptanceCriteria]: 'some acceptance criteria'
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.acceptanceCriteria).toEqual(workItem.fields[fieldKeys.acceptanceCriteria])
  })

  test('copies created date', function () {
    const createdDate = '2021-02-21T21:21:21Z'
    const expectedDate = new Date(createdDate)
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.createdDate]: createdDate
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.createdDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('copies activated date', function () {
    const activatedDate = '2020-08-08T08:08:08Z'
    const expectedDate = new Date(activatedDate)
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.activatedDate]: activatedDate
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.activatedDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('ignores activated date if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('activatedDate')
  })

  test('copies activated by', function () {
    const expectedActivatedBy = {
      name: 'Jane Dove',
      email: 'jane.dove@island.org'
    }
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.activatedBy]: {
        displayName: expectedActivatedBy.name,
        uniqueName: expectedActivatedBy.email
      }
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.activatedBy).toEqual(expectedActivatedBy)
  })

  test('ignores activated by if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('activatedBy')
  })

  test('copies assigned to', function () {
    const expectedAssignedTo = {
      name: 'Q',
      email: 'q@continuum.universe'
    }
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.assignedTo]: {
        displayName: expectedAssignedTo.name,
        uniqueName: expectedAssignedTo.email
      }
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.assignedTo).toEqual(expectedAssignedTo)
  })

  test('ignores assigned to if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('assignedTo')
  })

  createBoardSamples().forEach(function (board) {
    test(`copies board with ${board.name}`, function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, board.data)
      const realStory = mapToUserStory(workItem)
      expect(realStory.board).toEqual(board.expected)
    })
  })

  test('copies board column', function () {
    const expectedBoard = {
      column: 'Doing'
    }
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.boardColumn]: expectedBoard.column
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.board).toEqual(expectedBoard)
  })

  test('copies changed date', function () {
    const changedDate = '2021-03-31T12:12:12Z'
    const expectedDate = new Date(changedDate)
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.changedDate]: changedDate
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.changedDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('ignores changed date if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('changedDate')
  })

  test('copies closed by', function () {
    const expectedClosedBy = {
      name: 'Jean-Luc Picard',
      email: 'jl.picard@enterprise.starfleet'
    }
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.closedBy]: {
        displayName: expectedClosedBy.name,
        uniqueName: expectedClosedBy.email
      }
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.closedBy).toEqual(expectedClosedBy)
  })

  test('ignores closed by if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('closedBy')
  })

  test('copies first activated date', function () {
    const firstActivatedDate = '2018-03-18T18:18:18Z'
    const expectedDate = new Date(firstActivatedDate)
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.firstActivatedDate]: firstActivatedDate
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.firstActivatedDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('ignores first activated date if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('firstActivatedDate')
  })

  test('copies project', function () {
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.teamProject]: 'Project'
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.project).toEqual(workItem.fields[fieldKeys.teamProject])
  })

  test('copies revision', function () {
    const workItem = createBasicWorkItem()
    Object.assign(workItem, {
      rev: 42
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.revision).toEqual(workItem.rev)
  })

  test('copies tags', function () {
    const expectedTags = ['todo', 'urgent', 'did i say it\'s urgent?']
    const workItem = createBasicWorkItem()
    Object.assign(workItem.fields, {
      [fieldKeys.tags]: expectedTags.join(' ;')
    })
    const realStory = mapToUserStory(workItem)
    expect(realStory.tags).toEqual(expectedTags)
  })

  test('ignore tags if undefined', function () {
    const workItem = createBasicWorkItem()
    const realStory = mapToUserStory(workItem)
    expect(realStory).not.toHaveProperty('tags')
  })

  function createBasicWorkItem () {
    return {
      id: 512,
      fields: {
        'System.WorkItemType': 'User Story',
        'System.Title': 'Some item that needs care',
        'System.AreaPath': 'Project\\Team',
        'System.State': 'New'
      }
    }
  }

  function createBoardSamples () {
    return [
      {
        name: 'column',
        data: {
          [fieldKeys.boardColumn]: 'New'
        },
        expected: {
          column: 'New'
        }
      },
      {
        name: 'column and done',
        data: {
          [fieldKeys.boardColumn]: 'Doing',
          [fieldKeys.boardColumnDone]: true
        },
        expected: {
          column: 'Doing',
          columnDone: true
        }
      },
      {
        name: 'column, done and lane',
        data: {
          [fieldKeys.boardColumn]: 'Validating',
          [fieldKeys.boardColumnDone]: false,
          [fieldKeys.boardLane]: 'Urgent'
        },
        expected: {
          column: 'Validating',
          columnDone: false,
          lane: 'Urgent'
        }
      }
    ]
  }
})
