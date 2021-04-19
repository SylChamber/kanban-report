const createGetCurrentUserStoriesGetter = require('./get-current-user-stories')

describe('createGetCurrentUserStoriesGetter', () => {
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
      const fn = () => createGetCurrentUserStoriesGetter(input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', () => {
    const options = { organization: 'org', project: 'proj', fetch: jest.fn(), getTeamSettings: jest.fn() }
    const fn = createGetCurrentUserStoriesGetter(options)
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getCurrentUserStories', () => {
  function createOptions () {
    const teamSettings = { areas: ['Area51'], inProgressStates: ['Active'] }
    return {
      organization: 'org',
      project: 'proj',
      fetch: jest.fn(),
      getTeamSettings: jest.fn().mockName('getTeamSettings')
        .mockResolvedValue(teamSettings),
      url: 'https://devops'
    }
  }

  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  test.each([
    ['team (undefined)', [undefined], new ReferenceError('"team" is not defined.')],
    ['team (empty)', [''], new TypeError('"team" is empty.')]
  ])('requires %s', async function requires (testName, input, error) {
    const getCurrentUserStories = createGetCurrentUserStoriesGetter(createOptions())
    const fn = async () => await getCurrentUserStories(...input)
    return expect(fn).rejects.toThrow(error)
  })

  describe('returns', () => {
    test('reference date', async () => {
      const team = 'Area51'
      const referenceDate = new Date('2020-02-20T20:20:20Z')
      const idsData = { asOf: referenceDate.toISOString(), workItems: [] }
      const fetch = jest.fn().mockName('fetchMock').mockResolvedValueOnce({ json: async () => idsData })
      const getStories = createGetCurrentUserStoriesGetter({ ...createOptions(), fetch })
      const result = await getStories(team, referenceDate)
      expect(result).toHaveProperty('referenceDate')
      expect(result.referenceDate).toEqual(referenceDate)
    })

    test('user stories', async () => {
      const team = 'Area51'
      const referenceDate = new Date('2020-02-20T20:20:20Z')
      const idsData = {
        asOf: referenceDate.toISOString(),
        workItems: [{ id: 5, url: 'https://devops/org/proj/_apis/wit/workitems/5' }]
      }
      const detailsData = {
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
      }
      const commentData = {
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
      }
      const fetch = jest.fn().mockName('fetchMock')
        .mockResolvedValueOnce({ json: async () => idsData })
        .mockResolvedValueOnce({ json: async () => detailsData })
        .mockResolvedValueOnce({ json: async () => commentData })
      const expected = {
        referenceDate: referenceDate,
        stories: [{
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
        }]
      }
      const getStories = createGetCurrentUserStoriesGetter({ ...createOptions(), fetch })
      const result = await getStories(team, referenceDate)
      expect(result).toHaveProperty('stories')
      expect(result.stories).toBeInstanceOf(Array)
      expect(result.stories).toHaveLength(expected.stories.length)
      expect(result.stories).toEqual(expect.objectContaining(expected.stories))
    })
  })
})
