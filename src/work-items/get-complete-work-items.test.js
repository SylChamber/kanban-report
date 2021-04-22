const nodeFetch = require('node-fetch')
const fetchDecorator = require('../api/decorate-fetch-with-options')
const createCompleteWorkItemsGetter = require('./get-complete-work-items')

describe('createCompleteWorkItemsGetter', () => {
  [
    ['getWorkItemDetails (undefined)', [undefined, jest.fn().mockName('getWorkItemDetails')], new ReferenceError('"getWorkItemDetails" is not defined.')],
    ['getWorkItemDetails (not a function)', [{}, jest.fn().mockName('getWorkItemDetails')], new TypeError('"getWorkItemDetails" is not a function.')],
    ['getWorkItemComments (undefined)', [jest.fn().mockName('getWorkItemComments')], new TypeError('"getWorkItemComments" is not defined.')],
    ['getWorkItemComments (not a function)', [jest.fn().mockName('getWorkItemComments'), {}], new TypeError('"getWorkItemComments" is not a function.')]
  ].forEach(([testName, input, error]) => {
    test(`requires ${testName}`, () => {
      const fn = () => createCompleteWorkItemsGetter(...input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', () => {
    const fn = createCompleteWorkItemsGetter(...createDependenciesMocks())
    expect(fn).toBeInstanceOf(Function)
  })
})

function createDependenciesMocks () {
  return [jest.fn().mockName('getWorkItemDetails'), jest.fn().mockName('getWorkItemComments')]
}

describe('getCompleteWorkItems', () => {
  test.each([
    ['undefined', undefined, new ReferenceError('"ids" is not defined')],
    ['object provided', {}, new TypeError('"ids" must be an array')],
    ['empty', [], new TypeError('"ids" must not be empty')],
    ['not numbers', [1, 'two', 3, 'four'], new TypeError('all items in "ids" must be integers: "two", "four"')]
  ])('requires an array of ids (%s)', async function requiresIds (testName, input, error) {
    const getCompleteWorkItems = createCompleteWorkItemsGetter(...createDependenciesMocks())
    const fn = () => getCompleteWorkItems(input)
    return expect(fn).rejects.toThrow(error)
  })

  test('returns details and comments', async () => {
    const detailsMock = [
      {
        areaPath: 'TheWay',
        board: { column: 'Todo', columnDone: false },
        createdBy: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        createdDate: new Date('2020-02-20T20:20:20Z'),
        description: 'to do',
        id: 5,
        project: 'Proj',
        revision: 10,
        state: 'New',
        stateChangeDate: new Date('2020-02-20T20:20:20Z'),
        stateReason: 'New',
        title: 'Stuff to do',
        url: 'https://devops/workitems/5',
        workItemType: 'User Story'
      }
    ]
    const commentsMock = [
      {
        id: 500,
        workItemId: 5,
        version: 1,
        text: 'not cool, dude!',
        createdBy: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        createdDate: new Date('2021-02-21T21:21:21Z'),
        url: 'https://devops/workitems/5/comments/500'
      }
    ]
    const expected = {
      areaPath: 'TheWay',
      board: { column: 'Todo', columnDone: false },
      comments: [{
        id: 500,
        workItemId: 5,
        version: 1,
        text: 'not cool, dude!',
        createdBy: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        createdDate: new Date('2021-02-21T21:21:21Z'),
        url: 'https://devops/workitems/5/comments/500'
      }],
      createdBy: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      createdDate: new Date('2020-02-20T20:20:20Z'),
      description: 'to do',
      id: 5,
      project: 'Proj',
      revision: 10,
      state: 'New',
      stateChangeDate: new Date('2020-02-20T20:20:20Z'),
      stateReason: 'New',
      title: 'Stuff to do',
      url: 'https://devops/workitems/5',
      workItemType: 'User Story'
    }
    const getCompleteWorkItems = createCompleteWorkItemsGetter(
      jest.fn().mockName('getWorkItemDetails').mockResolvedValue(detailsMock),
      jest.fn().mockName('getWorkItemComments').mockResolvedValue(commentsMock))
    const real = await getCompleteWorkItems([5])
    expect(real).toBeInstanceOf(Array)
    expect(real).toHaveLength(1)
    expect(real[0]).toEqual(expect.objectContaining(expected))
  })

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('Azure integration', () => {
    let options
    let dependencies

    beforeAll(() => {
      options = {
        organization: process.env.AZURE_DEVOPS_ORG,
        project: process.env.AZURE_DEVOPS_PROJECT,
        fetch: fetchDecorator(nodeFetch, process.env.AZURE_DEVOPS_EXT_PAT)
      }
      dependencies = [
        require('./get-work-item-details')(options),
        require('./get-work-item-comments')(options)
      ]
    })

    test('can access Azure DevOps', async () => {
      const getWorkItems = createCompleteWorkItemsGetter(...dependencies)
      const ids = [1224, 1339, 1398]
      const result = await getWorkItems(ids)
      expect(result).not.toBeNull()
    })
  })
})
