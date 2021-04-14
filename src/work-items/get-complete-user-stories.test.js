const nodeFetch = require('node-fetch')
const fetchDecorator = require('../api/decorate-fetch-with-options')
const createCompleteUserStoriesGetter = require('./get-complete-user-stories')

describe('createCompleteUserStoriesGetter', () => {
  [
    ['options (undefined)', undefined, new ReferenceError("Cannot destructure property 'organization' of 'undefined' as it is undefined.")],
    ['organization (undefined)', { project: 'proj' }, new TypeError('The "organization" property is not defined.')],
    ['organization (empty)', { organization: '', project: 'proj' }, new TypeError('The "organization" property is empty.')],
    ['project (undefined)', { organization: 'org' }, new TypeError('The "project" property is not defined.')],
    ['project (empty)', { organization: 'org', project: '' }, new TypeError('The "project" property is empty.')],
    ['fetch (undefined)', { organization: 'org', project: 'proj' }, new TypeError('The "fetch" property is not defined.')],
    ['fetch (not a function)', { organization: 'org', project: 'proj', fetch: {} }, new TypeError('The "fetch" property is not a function.')],
    ['url (empty)', { organization: 'org', project: 'proj', fetch: jest.fn(), url: '' }, new TypeError('The "url" property is empty.')]
  ].forEach(([testName, input, error]) => {
    test(`requires ${testName}`, () => {
      const fn = () => createCompleteUserStoriesGetter(input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', () => {
    const options = createOptions()
    const fn = createCompleteUserStoriesGetter(options)
    expect(fn).toBeInstanceOf(Function)
  })
})

function createOptions () {
  return { organization: 'org', project: 'proj', fetch: jest.fn(), url: 'https://devops' }
}

function createFetchSub () {
  return jest.fn().mockName('fetchStub')
}

describe('getCompleteUserStories', () => {
  test.each([
    ['undefined', undefined, new ReferenceError('"ids" is not defined')],
    ['object provided', {}, new TypeError('"ids" must be an array')],
    ['empty', [], new TypeError('"ids" must not be empty')],
    ['not numbers', [1, 'two', 3, 'four'], new TypeError('all items in "ids" must be integers: "two", "four"')]
  ])('requires an array of ids (%s)', async function requiresIds (testName, input, error) {
    const getUserStoryDetails = createCompleteUserStoriesGetter({ ...createOptions(), fetch: createFetchSub() })
    const fn = () => getUserStoryDetails(input)
    return expect(fn).rejects.toThrow(error)
  })

  test('returns details and comments', async () => {
    const detailsResultMock = Promise.resolve({
      json: () => Promise.resolve({
        count: 1,
        value: [
          {
            id: 5,
            rev: 10,
            fields: {
              'System.Id': 5,
              'System.AreaPath': 'TheWay',
              'System.BoardColumn': 'Todo',
              'System.BoardColumnDone': false,
              'System.Description': 'to do',
              'System.TeamProject': 'Proj',
              'System.Title': 'Stuff to do',
              'System.State': 'New',
              'System.Reason': 'New',
              'Microsoft.VSTS.Common.StateChangeDate': '2020-02-20T20:20:20Z',
              'System.CreatedBy': {
                displayName: 'John Doe',
                uniqueName: 'john.doe@example.com'
              },
              'System.CreatedDate': '2020-02-20T20:20:20Z',
              'System.WorkItemType': 'User Story'
            },
            url: 'https://devops/workitems/5'
          }
        ]
      })
    })
    const commentsResultMock = Promise.resolve({
      json: () => Promise.resolve({
        totalCount: 1,
        count: 1,
        comments: [
          {
            workItemId: 5,
            id: 500,
            version: 1,
            text: 'not cool, dude!',
            createdBy: {
              displayName: 'John Doe',
              uniqueName: 'john.doe@example.com'
            },
            createdDate: '2021-02-21T21:21:21Z',
            url: 'https://devops/workitems/5/comments/500'
          }
        ]
      })
    })
    const expected = {
      acceptanceCriteria: undefined,
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
    const fetchMock = jest.fn().mockName('fetchMock')
      .mockReturnValueOnce(detailsResultMock)
      .mockReturnValueOnce(commentsResultMock)
    const getCompleteUserStories = createCompleteUserStoriesGetter({ ...createOptions(), fetch: fetchMock })
    const real = await getCompleteUserStories([5])
    expect(real).toBeInstanceOf(Array)
    expect(real).toHaveLength(1)
    expect(real[0]).toEqual(expect.objectContaining(expected))
  })

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('Azure integration', () => {
    let options

    beforeAll(() => {
      options = {
        organization: process.env.AZURE_DEVOPS_ORG,
        project: process.env.AZURE_DEVOPS_PROJECT,
        fetch: fetchDecorator(nodeFetch, process.env.AZURE_DEVOPS_EXT_PAT)
      }
    })

    test('can access Azure DevOps', async () => {
      const getStories = createCompleteUserStoriesGetter(options)
      const ids = [1224, 1339, 1398]
      const result = await getStories(ids)
      expect(result).not.toBeNull()
    })
  })
})
