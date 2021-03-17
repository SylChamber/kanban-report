import { assert } from 'chai'
import mapToUserStory from './map-to-user-story.js'

suite('work items', function () {
  suite('mapToUserStory', function () {
    test('function exists', function () {
      assert.isFunction(mapToUserStory)
    })

    test('copies id', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.id, workItem.id)
    })

    test('copies work item type', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.workItemType, workItem.fields['System.WorkItemType'])
    })

    test('copies title', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.title, workItem.fields['System.Title'])
    })

    test('copies area path', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.areaPath, workItem.fields['System.AreaPath'])
    })

    test('copies state', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        'System.State': 'Active'
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.state, workItem.fields['System.State'])
    })

    test('copies state reason', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        'System.Reason': 'Implementation started'
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.stateReason, workItem.fields['System.Reason'])
    })

    test('copies state changed date', function () {
      const stateDateChangedKey = 'Microsoft.VSTS.Common.StateChangeDate'
      const stateDateChange = '2020-02-20T20:20:20Z'
      const expectedDate = new Date(stateDateChange)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [stateDateChangedKey]: stateDateChange
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.stateChangedDate.valueOf(), expectedDate.valueOf())
    })

    test('copies description', function () {
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        'System.Description': 'some description'
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.description, workItem.fields['System.Description'])
    })

    test('copies acceptance criteria', function () {
      const acceptanceCriteriaKey = 'Microsoft.VSTS.Common.AcceptanceCriteria'
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [acceptanceCriteriaKey]: 'some acceptance criteria'
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.acceptanceCriteria, workItem.fields[acceptanceCriteriaKey])
    })

    test('copies created date', function () {
      const createdDate = '2021-02-21T21:21:21Z'
      const expectedDate = new Date(createdDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        'System.CreatedDate': createdDate
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.createdDate.valueOf(), expectedDate.valueOf())
    })

    test('copies activated date', function () {
      const activatedDateKey = 'Microsoft.VSTS.Common.ActivatedDate'
      const activatedDate = '2020-08-08T08:08:08Z'
      const expectedDate = new Date(activatedDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        [activatedDateKey]: activatedDate
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.activatedDate.valueOf(), expectedDate.valueOf())
    })

    test('ignores activated date if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      assert.isUndefined(realStory.activatedDate)
    })

    test('copies changed date', function () {
      const changedDate = '2021-03-31T12:12:12Z'
      const expectedDate = new Date(changedDate)
      const workItem = createBasicWorkItem()
      Object.assign(workItem.fields, {
        'System.ChangedDate': changedDate
      })
      const realStory = mapToUserStory(workItem)
      assert.strictEqual(realStory.changedDate.valueOf(), expectedDate.valueOf())
    })

    test('ignores changed date if undefined', function () {
      const workItem = createBasicWorkItem()
      const realStory = mapToUserStory(workItem)
      assert.isUndefined(realStory.changedDate)
      assert.isFalse(Object.keys(realStory).includes('changedDate'))
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
  })
})
