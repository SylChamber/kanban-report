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
  const options = { organization: 'org', personalAccessToken: 'token', project: 'proj' }

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

  test('returns current date if reference date was not provided', async () => {
    const storyOptions = { activeStates: ['Active'], areaPath: 'area51' }
    const fetchSpy = jest.fn().mockName('jestSpy')
    const getUserStories = createGetCurrentUserStoriesGetter(options, fetchSpy)
    const result = await getUserStories(storyOptions)
    expect(result.referenceDate.toLocaleDateString()).toEqual(new Date().toLocaleDateString())
  })
})
