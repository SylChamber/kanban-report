const nodeFetch = require('node-fetch')
const createGetCurrentUserStoryIdsGetter = require('./get-current-user-story-ids')
const fetchDecorator = require('../api/decorate-fetch-with-options')

describe('createCurrentGetUserStoryIdsGetter', () => {
  test.each([
    ['options', undefined, new ReferenceError('"options" is not defined')],
    [
      'options.organization',
      { project: 'proj' },
      new TypeError('The "options.organization" property is not defined')
    ],
    [
      'options.project',
      { organization: 'org' },
      new TypeError('The "options.project" property is not defined')
    ]
  ])('requires %s', function requiresParameters (paramName, input, expectedError) {
    const fn = () => createGetCurrentUserStoryIdsGetter(input, function () {})
    expect(fn).toThrow(expectedError)
  })

  test('requires fetch', () => {
    const options = { organization: 'org', project: 'proj' }
    const fn = () => createGetCurrentUserStoryIdsGetter(options, undefined)
    expect(fn).toThrow(new ReferenceError('"fetch" is not defined'))
  })

  test.each([
    ['undefined', {}, 'https://dev.azure.com'],
    ['empty', { url: '' }, 'https://dev.azure.com'],
    ['provided', { url: 'https://dev' }, 'https://dev']
  ])('provides Azure DevOps url (or not) if %s',
    async function providesUrl (testName, input, expected) {
      const options = { organization: 'org', project: 'proj', ...input }
      const fetch = jest.fn().mockReturnValue(Promise.resolve({
        json: async () => Promise.resolve({ asOf: '2020-02-20T20:20:20Z', items: [] })
      }))
      const userStoryOptions = { activeStates: ['Active'], areaPath: 'area' }
      const getStoryIds = createGetCurrentUserStoryIdsGetter(options, fetch)
      await getStoryIds(userStoryOptions)
      expect(fetch.mock.calls[0][0]).toEqual(expect.stringContaining(expected))
    })

  test('returns a function', () => {
    const options = { organization: 'org', project: 'proj' }
    const fn = createGetCurrentUserStoryIdsGetter(options, function () {})
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getCurrentUserStoryIds', () => {
  /**
   * @type {import('../api/create-azure-devops-client').AzureDevopsClientOptions}
   */
  const options = {
    organization: 'org',
    project: 'proj',
    url: 'https://devops'
  }

  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  test('requires user story options', async () => {
    const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, jest.fn())
    const fn = async () => await getCurrentUserStoryIds()
    return expect(fn).rejects.toThrow(new ReferenceError('"userStoryOptions" is not defined'))
  })

  test.each([
    ['none', { }],
    ['undefined', { areaPath: undefined }],
    ['empty string', { areaPath: '' }]
  ])('requires area path (%s)', function requiresAreaPath (paramName, input) {
    const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, jest.fn())
    const fn = () => getCurrentUserStoryIds(Object.assign(input, { activeStates: ['Active'] }))
    return expect(fn).rejects.toThrow(new TypeError('The "userStoryOptions.areaPath" property is not defined'))
  })

  test.each([
    ['undefined', { }, new TypeError('The "userStoryOptions.activeStates" property is not defined')],
    ['empty', { activeStates: [] }, new TypeError('The "userStoryOptions.activeStates" property must not be empty')]
  ])('requires active states (%s)', function requiresActiveStates (paramName, input, error) {
    const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, jest.fn())
    const fn = () => getCurrentUserStoryIds(Object.assign(input, { areaPath: 'area51' }))
    return expect(fn).rejects.toThrow(error)
  })

  describe('calls fetch', () => {
    test('with right url', async () => {
      /**
       * @type {import('./get-current-user-story-ids').UserStoryOptions}
       */
      const storyOptions = {
        activeStates: ['Active', 'Resolved'],
        areaPath: 'area51',
        referenceDate: new Date('2020-02-20T20:00:00Z')
      }
      const mockedResponse = {
        json: () => Promise.resolve({
          asOf: storyOptions.referenceDate.toISOString(),
          stories: []
        })
      }
      const expectedUrl = `${options.url}/${options.organization}/${options.project}/_apis/wit/wiql`
      const fetchSub = jest.fn().mockName('fetchSub').mockReturnValue(mockedResponse)
      const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, fetchSub)
      await getCurrentUserStoryIds(storyOptions)
      expect(fetchSub).toHaveBeenCalledWith(expectedUrl, expect.anything())
    })

    test.each([
      ['with reference date', new Date('2020-02-20T20:00:00Z')],
      ['without reference date', undefined]
    ])('with right options (%s)', async function withRightOptions (testName, refDate) {
      /**
       * @type {import('./get-current-user-story-ids').UserStoryOptions}
       */
      const storyOptions = {
        activeStates: ['Active', 'Resolved'],
        areaPath: 'area51',
        referenceDate: refDate
      }
      const mockedResponse = {
        json: () => {
          return {
            asOf: refDate ? refDate.toISOString() : new Date().toISOString(),
            stories: []
          }
        }
      }
      const statesString = storyOptions.activeStates.map(s => `'${s}'`).join(', ')
      const asOf = refDate
        ? ` ASOF '${storyOptions.referenceDate.toISOString()}'`
        : ''
      const expectedQuery = `Select Id from WorkItems where [Work Item Type] = 'User Story' and [Area Path] under '${storyOptions.areaPath}' and (State in (${statesString}) or (State = 'Closed' and [Closed Date] >= @Today)) order by [Changed Date] DESC${asOf}`
      const expectedOptions = {
        body: JSON.stringify({ query: expectedQuery }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
      const fetchSub = jest.fn().mockName('fetchSub').mockReturnValue(mockedResponse)
      const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, fetchSub)
      await getCurrentUserStoryIds(storyOptions)
      expect(fetchSub).toHaveBeenCalledWith(expect.anything(), expectedOptions)
    })
  })

  describe('returns', () => {
    const storyOptions = {
      activeStates: ['Active'],
      areaPath: 'area51',
      referenceDate: new Date('2020-02-20T20:20:20Z')
    }

    test('reference date', async () => {
      const data = {
        asOf: storyOptions.referenceDate.toISOString(),
        workItems: []
      }
      const response = { json: () => data }
      const fetch = jest.fn().mockName('fetchMock').mockReturnValue(response)
      const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, fetch)
      const result = await getCurrentUserStoryIds(storyOptions)
      expect(result).toHaveProperty('referenceDate')
      expect(result.referenceDate).toEqual(storyOptions.referenceDate)
    })

    test('user story references', async () => {
      const data = {
        asOf: storyOptions.referenceDate.toISOString(),
        workItems: [{ id: 60, url: 'https://devops/org/proj/_apis/wit/workitems/60' }]
      }
      const response = { json: () => data }
      const fetch = jest.fn().mockName('fetchMock').mockReturnValue(response)
      const getCurrentUserStoryIds = createGetCurrentUserStoryIdsGetter(options, fetch)
      const result = await getCurrentUserStoryIds(storyOptions)
      expect(result).toHaveProperty('stories')
      expect(result.stories).toEqual(data.workItems)
    })
  })

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('Azure integration', () => {
    let options
    let fetch

    beforeAll(() => {
      options = {
        organization: process.env.AZURE_DEVOPS_ORG,
        project: process.env.AZURE_DEVOPS_PROJECT
      }
      fetch = fetchDecorator(nodeFetch, process.env.AZURE_DEVOPS_EXT_PAT)
    })

    test('can access Azure DevOps', async () => {
      const getStoryIds = createGetCurrentUserStoryIdsGetter(options, fetch)
      const storyOptions = {
        areaPath: options.project,
        activeStates: ['Active', 'Validation', 'Attente'],
        referenceDate: new Date('2021-03-26T04:00:00Z')
      }
      const result = await getStoryIds(storyOptions)
      expect(result).not.toBeNull()
    })
  })
})

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevopsClientOptions} AzureDevopsClientOptions
 * @typedef {import('./get-current-user-story-ids').UserStoryOptions} UserStoryOptions
 * @typedef {import('./get-current-user-story-ids').UserStoriesResult} UserStoriesResult
 */
