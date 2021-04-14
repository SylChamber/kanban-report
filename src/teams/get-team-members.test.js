const createTeamMembersGetter = require('./get-team-members')

describe('createTeamMembersGetter', function () {
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
      const fn = () => createTeamMembersGetter(input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', function () {
    const options = { organization: 'org', project: 'proj', fetch: jest.fn() }
    const fn = createTeamMembersGetter(options)
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getTeamMembers', function () {
  const options = {
    organization: 'org',
    project: 'proj'
  }

  test.each([
    ['undefined', undefined],
    ['empty string', '']
  ])('requires team (%s)', function requiresTeam (name, team) {
    const fetch = createFetchStub().fetch
    const getTeamMembers = createTeamMembersGetter({ ...options, fetch })
    const promise = getTeamMembers(team)
    return expect(promise).rejects.toThrow(new ReferenceError('"team" is not defined'))
  })

  test('calls fetch with right parameters', async function () {
    const fetchStub = createFetchStub()
    const team = 'teamd'
    const expected = {
      url: `https://dev.azure.com/${options.organization}/_apis/projects/${options.project}/teams/${team}/members`
    }
    fetchStub.setExpectedCall(expected)
    const getTeamMembers = createTeamMembersGetter({ ...options, fetch: fetchStub.fetch })
    await getTeamMembers(team)
    const fetchWasCalled = fetchStub.wasCalledWith(expected.url)
    if (!fetchWasCalled) {
      throw new Error(fetchStub.getErrorMessage())
    }
    expect(fetchWasCalled).toBeTruthy()
  })

  test('returns members mapped to persons', async function () {
    const fetchStub = createFetchStub()
    const team = 'teamd'
    const returnedData = {
      value: [
        { identity: { displayName: 'John Doe', uniqueName: 'john.doe@example.com' } },
        { identity: { displayName: 'Sam Adams', uniqueName: 'sam.adams@samadams.com' } }
      ],
      count: 2
    }
    const expected = [
      { name: 'John Doe', email: 'john.doe@example.com' },
      { name: 'Sam Adams', email: 'sam.adams@samadams.com' }
    ]
    fetchStub.setReturnedData(returnedData)
    const getTeamMembers = createTeamMembersGetter({ ...options, fetch: fetchStub.fetch })
    const result = await getTeamMembers(team)
    expect(result).toBeInstanceOf(Array)
    expect(result).toEqual(expect.arrayContaining(expected))
    expect(result).toHaveLength(expected.length)
  })

  test('returns persons only and discards groups', async function () {
    const fetchStub = createFetchStub()
    const team = 'teamA'
    const returnedData = {
      value: [
        { identity: { displayName: 'John Doe', uniqueName: 'john.doe@example.com' } },
        {
          identity: {
            displayName: 'Superteam',
            uniqueName: 'vstfs:///Framework/IdentityDomain/[GUID]/\\Superteam',
            isContainer: true
          }
        }
      ],
      count: 2
    }
    const expected = [{ name: 'John Doe', email: 'john.doe@example.com' }]
    fetchStub.setReturnedData(returnedData)
    const getTeamMembers = createTeamMembersGetter({ ...options, fetch: fetchStub.fetch })
    const result = await getTeamMembers(team)
    expect(result).toHaveLength(expected.length)
    expect(result).toEqual(expect.arrayContaining(expected))
  })

  function createFetchStub () {
    const response = {
      ok: true,
      status: 200,
      statusText: 'OK',
      async json () { return new Promise(resolve => resolve(returnedData)) }
    }
    let returnedData = { value: [], count: 0 }
    const calls = []
    let expectedCall = {}

    return {
      calls () {
        return calls
      },

      async fetch (url, options) {
        calls.push({
          url,
          options
        })

        return new Promise((resolve, reject) => {
          resolve(response)
        })
      },

      getErrorMessage () {
        return `
  expected a call to fetch with:
  ${this.formatCall(expectedCall)}
  actual calls:  ${calls.length === 0 ? 'none' : ''}
  ${calls.map(this.formatCall)}
  `
      },

      formatCall (call) {
        return `
  url: ${call.url}
  options: ${JSON.stringify(call.options)}
  
  `
      },

      setExpectedCall (call) {
        expectedCall = call
      },

      setReturnedData (data) {
        returnedData = data
      },

      setReturnedState (state) {
        Object.assign(response, state)
      },

      wasCalledWith (url, options) {
        const callEquals = this.callEqualsFn(url, options)
        return calls.some(callEquals)
      },

      callEqualsFn (url, options) {
        return function (call) {
          return call.url === url &&
              JSON.stringify(call.options) === JSON.stringify(options)
        }
      }
    }
  }
})
