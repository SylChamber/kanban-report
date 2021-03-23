const createGetCurrentUserStoriesGetter = require('./get-current-user-stories')

describe('createCurrentGetUserStoriesGetter', () => {
  test.each([
    ['options', undefined, new ReferenceError('"options" is not defined')],
    [
      'options.organization',
      { personalAccessToken: 'token', project: 'proj' },
      new TypeError('The "options.organization" property is not defined')
    ],
    [
      'options.personalAccessToken',
      { organization: 'org', project: 'proj' },
      new TypeError('The "options.personalAccessToken" property is not defined')
    ],
    [
      'options.project',
      { organization: 'org', personalAccessToken: 'token' },
      new TypeError('The "options.project" property is not defined')
    ]
  ])('requires %s', (paramName, input, expectedError) => {
    const fn = () => createGetCurrentUserStoriesGetter(input, function () {})
    expect(fn).toThrow(expectedError)
  })

  test('requires fetch', () => {
    const options = { organization: 'org', personalAccessToken: 'token', project: 'proj' }
    const fn = () => createGetCurrentUserStoriesGetter(options, undefined)
    expect(fn).toThrow(new ReferenceError('"fetch" is not defined'))
  })

  test('returns a function', () => {
    const options = { organization: 'org', personalAccessToken: 'token', project: 'proj' }
    const fn = createGetCurrentUserStoriesGetter(options, function () {})
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getCurrentUserStories', () => {
  /**
   * @type {import('../api/create-azure-devops-client').AzureDevopsClientOptions}
   */
  const options = {
    organization: 'org',
    personalAccessToken: 'token',
    project: 'proj',
    url: 'https://devops'
  }

  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  test('requires user story options', async () => {
    const getCurrentUserStories = createGetCurrentUserStoriesGetter(options, jest.fn())
    const fn = async () => await getCurrentUserStories()
    return expect(fn).rejects.toThrow(new ReferenceError('"userStoryOptions" is not defined'))
  })

  test.each([
    ['none', { }],
    ['undefined', { areaPath: undefined }],
    ['empty string', { areaPath: '' }]
  ])('requires area path (%s)', (paramName, input) => {
    const getCurrentUserStories = createGetCurrentUserStoriesGetter(options, jest.fn())
    const fn = () => getCurrentUserStories(Object.assign(input, { activeStates: ['Active'] }))
    return expect(fn).rejects.toThrow(new TypeError('The "userStoryOptions.areaPath" property is not defined'))
  })

  test.each([
    ['undefined', { }, new TypeError('The "userStoryOptions.activeStates" is not defined')],
    ['empty', { activeStates: [] }, new TypeError('The "userStoryOptions.activeStates" must not be empty')]
  ])('requires active states (%s)', (paramName, input, error) => {
    const getCurrentUserStories = createGetCurrentUserStoriesGetter(options, jest.fn())
    const fn = () => getCurrentUserStories(Object.assign(input, { areaPath: 'area51' }))
    return expect(fn).rejects.toThrow(error)
  })

  describe('calls fetch', () => {
    test('with right url', async () => {
      /**
       * @type {import('./get-current-user-stories').UserStoryOptions}
       */
      const storyOptions = {
        activeStates: ['Active', 'Resolved'],
        areaPath: 'area51',
        referenceDate: new Date('2020-02-20T20:00:00Z')
      }
      const expectedUrl = `${options.url}/${options.organization}/${options.project}/_apis/wit/wiql`
      const fetchSub = jest.fn().mockName('fetchSub')
      const getCurrentUserStories = createGetCurrentUserStoriesGetter(options, fetchSub)
      await getCurrentUserStories(storyOptions)
      expect(fetchSub).toHaveBeenCalledWith(expectedUrl, expect.anything())
    })

    test.each([
      ['with reference date', new Date('2020-02-20T20:00:00Z')],
      ['without reference date', undefined]
    ])('with right options (%s)', async function withRightOptions (testName, refDate) {
      /**
       * @type {import('./get-current-user-stories').UserStoryOptions}
       */
      const storyOptions = {
        activeStates: ['Active', 'Resolved'],
        areaPath: 'area51',
        referenceDate: refDate
      }
      const statesString = storyOptions.activeStates.map(s => `'${s}'`).join(', ')
      const asOf = refDate
        ? ` ASOF '${storyOptions.referenceDate.toISOString()}'`
        : ''
      const expectedQuery = `Select Id from WorkItems where [Work Item Type] = 'User Story' and [Area Path] under '${storyOptions.areaPath}' and (State in (${statesString}) or (State = 'Closed' and [Closed Date] >= @Today - 1)) order by [Changed Date] DESC${asOf}`
      const expectedOptions = {
        body: JSON.stringify({ query: expectedQuery }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
      const fetchSub = jest.fn().mockName('fetchSub')
      const getCurrentUserStories = createGetCurrentUserStoriesGetter(options, fetchSub)
      await getCurrentUserStories(storyOptions)
      expect(fetchSub).toHaveBeenCalledWith(expect.anything(), expectedOptions)
    })
  })

  test('returns reference date', async () => {
    const storyOptions = {
      activeStates: ['Active'],
      areaPath: 'area51',
      referenceDate: new Date('2020-02-20T20:20:20Z')
    }
    const getCurrentUserStories = createGetCurrentUserStoriesGetter(options, function () {})
    const result = await getCurrentUserStories(storyOptions)
    expect(result).toHaveProperty('referenceDate')
    expect(result.referenceDate).toEqual(storyOptions.referenceDate)
  })
})

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevopsClientOptions}
 * @typedef {import('./get-current-user-stories').UserStoryOptions}
 */
