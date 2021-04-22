const createWorkItemCommentsGetter = require('./get-work-item-comments')

describe('createWorkItemCommentsGetter', () => {
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
      const fn = () => createWorkItemCommentsGetter(input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', () => {
    const options = createOptions()
    const fn = createWorkItemCommentsGetter(options)
    expect(fn).toBeInstanceOf(Function)
  })
})

function createOptions () {
  return { organization: 'org', project: 'proj', fetch: jest.fn().mockName('fetchStub'), url: 'https://devops' }
}

describe('getWorkItemComments', () => {
  test.each([
    ['undefined', undefined, new ReferenceError('"id" is not defined')],
    ['string', '1', new TypeError('"id" is not an integer')],
    ['double', 1.5, new TypeError('"id" is not an integer')]
  ])('requires id (%s)', async function requiresId (testName, input, error) {
    const getWorkItemComments = createWorkItemCommentsGetter(createOptions())
    const fn = () => getWorkItemComments(input)
    return expect(fn).rejects.toThrow(error)
  })

  test('maps results from the API', async () => {
    const mockReturn = Promise.resolve({
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
    const fetchMock = jest.fn().mockName('fetchMock').mockReturnValue(mockReturn)
    const getWorkItemComments = createWorkItemCommentsGetter({ ...createOptions(), fetch: fetchMock })
    const real = await getWorkItemComments(5)
    expect(real).toBeInstanceOf(Array)
    expect(real).toHaveLength(1)
    expect(real[0]).toEqual(expect.objectContaining(expected))
  })
})
