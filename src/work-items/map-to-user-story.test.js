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

  describe('copies', () => {
    test('acceptance criteria', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.acceptanceCriteria]: 'some acceptance criteria'
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.acceptanceCriteria).toEqual(workItem.fields[fieldKeys.acceptanceCriteria])
    })

    test('activated by', function () {
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

    test('activated date', function () {
      const activatedDate = '2020-08-08T08:08:08Z'
      const expectedDate = new Date(activatedDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.activatedDate]: activatedDate
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.activatedDate.valueOf()).toEqual(expectedDate.valueOf())
    })

    test('area path', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory.areaPath).toEqual(workItem.fields[fieldKeys.areaPath])
    })

    test('assigned to', function () {
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

    createBoardSamples().forEach(function (board) {
      test(`copies board with ${board.name}`, function () {
        const workItem = createBasicWorkItem()
        Object.assign(workItem.fields, board.data)
        const realStory = mapToUserStory(workItem)
        expect(realStory.board).toEqual(board.expected)
      })
    })

    test('changed by', () => {
      const expectedChangedBy = {
        name: 'Homer Simpsons',
        email: 'homer.simpsons@meltdown.com'
      }
      const basic = createBasicWorkItem()
      const workItem = {
        ...basic,
        fields: {
          ...basic.fields,
          [fieldKeys.changedBy]: {
            displayName: expectedChangedBy.name,
            uniqueName: expectedChangedBy.email
          }
        }
      }
      const realStory = mapToUserStory(workItem)
      expect(realStory.changedBy).toEqual(expectedChangedBy)
    })

    test('changed date', function () {
      const changedDate = '2021-03-31T12:12:12Z'
      const expectedDate = new Date(changedDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.changedDate]: changedDate
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.changedDate.valueOf()).toEqual(expectedDate.valueOf())
    })

    test('closed by', function () {
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

    test('closed date', function () {
      const closedDate = '2020-12-12T12:12:12Z'
      const expectedDate = new Date(closedDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.closedDate]: closedDate
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.closedDate.valueOf()).toEqual(expectedDate.valueOf())
    })

    test('created by', function () {
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

    test('created date', function () {
      const createdDate = '2021-02-21T21:21:21Z'
      const expectedDate = new Date(createdDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.createdDate]: createdDate
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.createdDate.valueOf()).toEqual(expectedDate.valueOf())
    })

    test('description', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.description]: 'some description'
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.description).toEqual(workItem.fields[fieldKeys.description])
    })

    test('first activated date', function () {
      const firstActivatedDate = '2018-03-18T18:18:18Z'
      const expectedDate = new Date(firstActivatedDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.firstActivatedDate]: firstActivatedDate
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.firstActivatedDate.valueOf()).toEqual(expectedDate.valueOf())
    })

    test('id', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory.id).toEqual(workItem.id)
    })

    test('project', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.teamProject]: 'Project'
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.project).toEqual(workItem.fields[fieldKeys.teamProject])
    })

    test('revision', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem, {
        rev: 42
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.revision).toEqual(workItem.rev)
    })

    test('state', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.state]: 'Active'
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.state).toEqual(workItem.fields[fieldKeys.state])
    })

    test('state reason', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.stateReason]: 'Implementation started'
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.stateReason).toEqual(workItem.fields[fieldKeys.stateReason])
    })

    test('state change date', function () {
      const stateChangeDate = '2020-02-20T20:20:20Z'
      const expectedDate = new Date(stateChangeDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.stateChangeDate]: stateChangeDate
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.stateChangeDate.valueOf()).toEqual(expectedDate.valueOf())
    })

    test('tags', function () {
      const expectedTags = ['todo', 'urgent', 'did i say it\'s urgent?']
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [fieldKeys.tags]: expectedTags.join(' ;')
      })
      const realStory = mapToUserStory(workItem)
      expect(realStory.tags).toEqual(expectedTags)
    })

    test('title', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory.title).toEqual(workItem.fields[fieldKeys.title])
    })

    test('work item type', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory.workItemType).toEqual(workItem.fields[fieldKeys.workItemType])
    })
  })

  describe('ignores', () => {
    test('activated by if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('activatedBy')
    })

    test('activated date if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('activatedDate')
    })

    test('assigned to if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('assignedTo')
    })

    test('changed by if undefined', () => {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('changedBy')
    })

    test('changed date if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('changedDate')
    })

    test('closed by if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('closedBy')
    })

    test('closed date if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('closedDate')
    })

    test('first activated date if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('firstActivatedDate')
    })

    test('ignore tags if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      expect(realStory).not.toHaveProperty('tags')
    })
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
