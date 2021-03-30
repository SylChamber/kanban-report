const createCompleteUserStoriesGetter = require('./get-complete-user-stories')

describe('createCompleteUserStoriesGetter', () => {
  test.each([
    ['options', undefined, new TypeError("Cannot destructure property 'organization' of 'undefined' as it is undefined.")],
    ['options.organization', { project: 'proj' }, new TypeError('The "organization" property of the options is not defined')],
    ['options.project', { organization: 'org' }, new TypeError('The "project" property of the options is not defined')]
  ])('requires %s', function requiresParameters (testName, input, error) {
    const fn = () => createCompleteUserStoriesGetter(input)
    expect(fn).toThrow(error)
  })

  test('requires fetch', () => {
    const options = createOptions()
    const fn = () => createCompleteUserStoriesGetter(options, undefined)
    expect(fn).toThrow(new ReferenceError('"fetch" is not defined'))
  })

  test('returns a function', () => {
    const options = createOptions()
    const fetch = jest.fn()
    const fn = createCompleteUserStoriesGetter(options, fetch)
    expect(fn).toBeInstanceOf(Function)
  })
})

function createOptions () {
  return { organization: 'org', project: 'proj', url: 'https://devops' }
}

function createFetchSub () {
  return jest.fn().mockName('fetchStub')
}

describe('getCompleteUserStories', () => {
  test.each([
    ['undefined', undefined, new ReferenceError('"ids" is not defined')],
    ['object provided', {}, new TypeError('"ids" must be an array')],
    ['empty', [], new TypeError('"ids" must not be empty')],
    ['not numbers', [1, 'two', 3, 'four'], new TypeError('all items in "ids" must be integers: "two", "four"')]
  ])('requires an array of ids (%s)', async function requiresIds (testName, input, error) {
    const getUserStoryDetails = createCompleteUserStoriesGetter(createOptions(), createFetchSub())
    const fn = () => getUserStoryDetails(input)
    return expect(fn).rejects.toThrow(error)
  })
})
