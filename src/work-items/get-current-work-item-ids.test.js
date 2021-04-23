const nodeFetch = require('node-fetch')
const createGetCurrentWorkItemIdsGetter = require('./get-current-work-item-ids')
const fetchDecorator = require('../api/decorate-fetch-with-options')

describe('createGetCurrentWorkItemIdsGetter', () => {
  [
    ['(undefined)', undefined, new ReferenceError("Cannot destructure property 'organization' of 'undefined' as it is undefined.")],
    ['.organization (undefined)', { project: 'proj' }, new TypeError('The "organization" property is not defined.')],
    ['.organization (empty)', { organization: '', project: 'proj' }, new TypeError('The "organization" property is empty.')],
    ['.project (undefined)', { organization: 'org' }, new TypeError('The "project" property is not defined.')],
    ['.project (empty)', { organization: 'org', project: '' }, new TypeError('The "project" property is empty.')],
    ['.fetch (undefined)', { organization: 'org', project: 'proj' }, new TypeError('The "fetch" property is not defined.')],
    ['.fetch (not a function)', { organization: 'org', project: 'proj', fetch: {} }, new TypeError('The "fetch" property is not a function.')],
    ['.url (empty)', { organization: 'org', project: 'proj', fetch: jest.fn(), url: '' }, new TypeError('The "url" property is empty.')]
  ].forEach(([testName, input, error]) => {
    test(`requires options ${testName}`, function requires () {
      const fn = () => createGetCurrentWorkItemIdsGetter(input, jest.fn().mockName('getTeamSettings'))
      expect(fn).toThrow(error)
    })
  })

  test.each([
    ['undefined', undefined, new TypeError('"getTeamSettings" is not defined.')],
    ['not a function', {}, new TypeError('"getTeamSettings" is not a function.')]
  ])('requires getTeamSettings (%s)', (testName, input, error) => {
    const options = { organization: 'org', project: 'proj', fetch: jest.fn() }
    const fn = () => createGetCurrentWorkItemIdsGetter(options, input)
    expect(fn).toThrow(error)
  })

  test('returns a function', () => {
    const options = { organization: 'org', project: 'proj', fetch: jest.fn() }
    const fn = createGetCurrentWorkItemIdsGetter(options, jest.fn())
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getCurrentWorkItemIds', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  function createOptions () {
    return {
      organization: 'org',
      project: 'proj',
      fetch: jest.fn(),
      url: 'https://devops'
    }
  }

  function createGetTeamSettingsMock () {
    const teamSettings = { areas: ['Team'], inProgressStates: ['Active'] }
    return jest.fn().mockName('getTeamSettings').mockResolvedValue(teamSettings)
  }

  test.each([
    ['team (undefined)', [undefined], new ReferenceError('"team" is not defined.')],
    ['team (empty)', [''], new TypeError('"team" is empty.')]
  ])('requires %s', async function requires (testName, input, error) {
    const getCurrentWorkItemIds = createGetCurrentWorkItemIdsGetter(
      createOptions(),
      createGetTeamSettingsMock())
    const fn = async () => await getCurrentWorkItemIds(...input)
    return expect(fn).rejects.toThrow(error)
  })

  describe('calls fetch', () => {
    test('with right url', async () => {
      const team = 'Area51'
      const referenceDate = new Date('2020-02-20T20:00:00Z')
      const mockedResponse = {
        json: () => Promise.resolve({
          asOf: referenceDate.toISOString(),
          stories: []
        })
      }
      const fetch = jest.fn().mockName('fetch').mockReturnValue(mockedResponse)
      const teamSettings = { areas: ['Area51'], inProgressStates: ['Active', 'Resolved'] }
      const getTeamSettings = jest.fn().mockName('getTeamSettings').mockResolvedValue(teamSettings)
      const options = { ...createOptions(), fetch }
      const expectedUrl = `${options.url}/${options.organization}/${options.project}/_apis/wit/wiql`
      const getCurrentWorkItemIds = createGetCurrentWorkItemIdsGetter(options, getTeamSettings)
      await getCurrentWorkItemIds(team, referenceDate)
      expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.anything())
    })

    test.each([
      ['with reference date', new Date('2020-02-20T20:00:00Z')],
      ['without reference date', undefined]
    ])('with right options (%s)', async function withRightOptions (testName, refDate) {
      const team = 'Area51'
      const mockedResponse = {
        json: () => {
          return {
            asOf: refDate ? refDate.toISOString() : new Date().toISOString(),
            stories: []
          }
        }
      }
      const fetch = jest.fn().mockName('fetch').mockReturnValue(mockedResponse)
      const teamSettings = { areas: ['Area51'], inProgressStates: ['Active', 'Resolved'] }
      const getTeamSettings = jest.fn().mockName('getTeamSettings').mockResolvedValue(teamSettings)
      const options = { ...createOptions(), fetch }
      const statesString = teamSettings.inProgressStates.map(s => `'${s}'`).join(', ')
      const areasString = teamSettings.areas.map(a => `'${a}'`).join(', ')
      const asOf = refDate
        ? ` ASOF '${refDate.toISOString()}'`
        : ''
      const expectedQuery = `Select Id from WorkItems where [Work Item Type] = 'User Story' and [Area Path] in (${areasString}) and (State in (${statesString}) or (State = 'Closed' and [Closed Date] >= @Today)) order by [Changed Date] DESC${asOf}`
      const expectedOptions = {
        body: JSON.stringify({ query: expectedQuery }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
      const getCurrentWorkItemIds = createGetCurrentWorkItemIdsGetter(options, getTeamSettings)
      await getCurrentWorkItemIds(team, refDate)
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expectedOptions)
    })
  })

  describe('returns', () => {
    function createStoryOptions () {
      // [team, referenceDate]
      return ['Area51', new Date('2020-02-20T20:20:20Z')]
    }

    test('reference date', async () => {
      const [team, referenceDate] = createStoryOptions()
      const data = {
        asOf: referenceDate.toISOString(),
        workItems: []
      }
      const response = { json: () => data }
      const fetch = jest.fn().mockName('fetchMock').mockReturnValue(response)
      const teamSettings = { areas: [team], inProgressStates: ['Active'] }
      const getTeamSettings = jest.fn().mockName('getTeamSettings').mockResolvedValue(teamSettings)
      const getCurrentWorkItemIds = createGetCurrentWorkItemIdsGetter({
        ...createOptions(),
        fetch
      }, getTeamSettings)
      const result = await getCurrentWorkItemIds(team, referenceDate)
      expect(result).toHaveProperty('referenceDate')
      expect(result.referenceDate).toEqual(referenceDate)
    })

    test('work item references', async () => {
      const [team, referenceDate] = createStoryOptions()
      const data = {
        asOf: referenceDate.toISOString(),
        workItems: [{ id: 60, url: 'https://devops/org/proj/_apis/wit/workitems/60' }]
      }
      const response = { json: () => data }
      const fetch = jest.fn().mockName('fetchMock').mockReturnValue(response)
      const teamSettings = { areas: [team], inProgressStates: ['Active'] }
      const getTeamSettings = jest.fn().mockName('getTeamSettings').mockResolvedValue(teamSettings)
      const getCurrentWorkItemIds = createGetCurrentWorkItemIdsGetter(
        {
          ...createOptions(),
          fetch
        }, getTeamSettings)
      const result = await getCurrentWorkItemIds(team, referenceDate)
      expect(result).toHaveProperty('items')
      expect(result.items).toEqual(data.workItems)
    })
  })

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('Azure integration', () => {
    function getOptions () {
      return {
        organization: process.env.AZURE_DEVOPS_ORG,
        project: process.env.AZURE_DEVOPS_PROJECT,
        fetch: fetchDecorator(nodeFetch, process.env.AZURE_DEVOPS_EXT_PAT)
      }
    }

    function getTeamSettings (options) {
      return require('../teams/get-team-settings')(options)
    }

    test('can access Azure DevOps', async () => {
      const options = getOptions()
      const getCurrentWorkItemIds = createGetCurrentWorkItemIdsGetter(options, getTeamSettings(options))
      const team = process.env.AZURE_DEVOPS_EXT_TEAM
      const referenceDate = new Date('2021-03-26T04:00:00Z')
      const result = await getCurrentWorkItemIds(team, referenceDate)
      expect(result).not.toBeNull()
    })
  })
})
