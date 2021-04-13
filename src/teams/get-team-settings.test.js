const createGetTeamSettingsGetter = require('./get-team-settings')

describe('createGetTeamSettingsGetter', () => {
  [
    ['options (undefined)', undefined, new ReferenceError("Cannot destructure property 'organization' of 'undefined' as it is undefined.")],
    ['options.organization (undefined)', { project: 'proj', team: 'team' }, new TypeError('The "options.organization" property is not defined.')],
    ['options.organization (empty)', { organization: '', project: 'proj', team: 'team' }, new TypeError('The "options.organization" property is empty.')],
    ['options.project (undefined)', { organization: 'org', team: 'team' }, new TypeError('The "options.project" property is not defined.')],
    ['options.project (empty)', { organization: 'org', project: '', team: 'team' }, new TypeError('The "options.project" property is empty.')]
  ].forEach(([testName, input, error]) => {
    test(`requires ${testName}`, () => {
      const fn = () => createGetTeamSettingsGetter(input)
      expect(fn).toThrow(error)
    })
  })

  test('requires fetch', () => {
    const options = { organization: 'org', project: 'proj' }
    const fn = () => createGetTeamSettingsGetter(options, undefined)
    expect(fn).toThrow(new ReferenceError('"fetch" is not defined.'))
  })

  test('returns a function', () => {
    const options = { organization: 'org', project: 'proj' }
    const fn = createGetTeamSettingsGetter(options, jest.fn().mockName('fetchStub'))
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getTeamSettings', () => {
  const options = { organization: 'org', project: 'proj' }

  ;[
    ['undefined', undefined, new ReferenceError('"team" is not defined.')],
    ['empty', '', new TypeError('"team" is empty.')]
  ].forEach(([testName, input, error]) => {
    test(`requires team (${testName})`, async () => {
      const getTeamSettings = createGetTeamSettingsGetter(options, jest.fn().mockName('fetchStub'))
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
    const getTeamSettings = createGetTeamSettingsGetter(options, fetchMock)
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
    const getTeamSettings = createGetTeamSettingsGetter(options, fetchMock)
    const actual = await getTeamSettings('team')
    expect(actual).toEqual(expect.objectContaining(expected))
  })
})
