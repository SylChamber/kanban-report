const createUserStoryDetailsGetter = require('./get-user-story-details')

describe('createUserStoryDetailsGetter', () => {
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
      const fn = () => createUserStoryDetailsGetter(input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', () => {
    const options = createOptions()
    const fn = createUserStoryDetailsGetter(options)
    expect(fn).toBeInstanceOf(Function)
  })
})

function createOptions () {
  return { organization: 'org', project: 'proj', fetch: jest.fn().mockName('fetchStub'), url: 'https://devops' }
}

describe('getUserStoryDetails', () => {
  test.each([
    ['undefined', undefined, new ReferenceError('"ids" is not defined')],
    ['object provided', {}, new TypeError('"ids" must be an array')],
    ['empty', [], new TypeError('"ids" must not be empty')],
    ['not numbers', [1, 'two', 3, 'four'], new TypeError('all items in "ids" must be integers: "two", "four"')]
  ])('requires an array of ids (%s)', async function requiresIds (testName, input, error) {
    const getUserStoryDetails = createUserStoryDetailsGetter(createOptions())
    const fn = () => getUserStoryDetails(input)
    return expect(fn).rejects.toThrow(error)
  })

  test('returns results from the API', async () => {
    const mockReturn = Promise.resolve({
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
              'System.State': 'New',
              'System.CreatedBy': {
                displayName: 'John Doe',
                uniqueName: 'john.doe@example.com'
              },
              'System.CreatedDate': '2020-02-20T20:20:20Z'
            }
          }
        ]
      })
    })
    const expected = [{
      acceptanceCriteria: undefined,
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
      state: 'New'
    }]
    const fetchMock = jest.fn().mockName('fetchMock').mockReturnValue(mockReturn)
    const getUserStoryDetails = createUserStoryDetailsGetter({ ...createOptions(), fetch: fetchMock })
    const real = await getUserStoryDetails([5])
    expect(real).toBeInstanceOf(Array)
    expect(real).toHaveLength(1)
    expect(real[0]).toEqual(expect.objectContaining(expected[0]))
  })
})
