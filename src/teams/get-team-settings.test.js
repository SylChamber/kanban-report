const createGetTeamSettingsGetter = require('./get-team-settings')

describe('createGetTeamSettingsGetter', () => {
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
      const fn = () => createGetTeamSettingsGetter(input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', () => {
    const options = { organization: 'org', project: 'proj', fetch: jest.fn().mockName('fetchStub') }
    const fn = createGetTeamSettingsGetter(options)
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getTeamSettings', () => {
  const options = { organization: 'org', project: 'proj', fetch: jest.fn().mockName('fetchStub') }

  ;[
    ['undefined', undefined, new ReferenceError('"team" is not defined.')],
    ['empty', '', new TypeError('"team" is empty.')]
  ].forEach(([testName, input, error]) => {
    test(`requires team (${testName})`, async () => {
      const getTeamSettings = createGetTeamSettingsGetter(options)
      const fn = () => getTeamSettings(input)
      return expect(fn).rejects.toThrow(error)
    })
  })

  test('returns "in progress" states', async () => {
    const backlogConfig = {
      workItemTypeMappedStates: [
        {
          workItemTypeName: 'Task',
          states: {
            New: 'Proposed',
            Active: 'InProgress',
            Closed: 'Completed'
          }
        },
        {
          workItemTypeName: 'User Story',
          states: {
            New: 'Proposed',
            Active: 'InProgress',
            Resolved: 'InProgress',
            Closed: 'Completed'
          }
        }
      ]
    }
    const teamFieldValues = { defaultValue: 'Project', values: [{ value: 'Project' }] }
    const expected = { inProgressStates: ['Active', 'Resolved'] }
    const fetchMock = jest.fn().mockName('fetchMock')
      .mockResolvedValueOnce({ json: async () => backlogConfig })
      .mockResolvedValueOnce({ json: async () => teamFieldValues })
    const getTeamSettings = createGetTeamSettingsGetter({ ...options, fetch: fetchMock })
    const actual = await getTeamSettings('team')
    expect(actual).toEqual(expect.objectContaining(expected))
  })

  test('returns areas', async () => {
    const backlogConfig = {
      workItemTypeMappedStates: [
        { workItemTypeName: 'User Story', states: { New: 'Proposed', Active: 'InProgress', Closed: 'Completed' } }
      ]
    }
    const teamFieldValues = {
      defaultValue: 'Project\\Team',
      values: [{ value: 'Project\\Team' }, { value: 'Project\\Team\\Analysis' }, { value: 'Project\\Team\\Dev' }]
    }
    const expected = { areas: ['Project\\Team', 'Project\\Team\\Analysis', 'Project\\Team\\Dev'] }
    const fetchMock = jest.fn().mockName('fetchMock')
      .mockResolvedValueOnce({ json: async () => backlogConfig })
      .mockResolvedValueOnce({ json: async () => teamFieldValues })
    const getTeamSettings = createGetTeamSettingsGetter({ ...options, fetch: fetchMock })
    const actual = await getTeamSettings('team')
    expect(actual).toEqual(expect.objectContaining(expected))
  })
})
