const createUserStoryCommentsGetter = require('./get-user-story-comments')

describe('createUserStoryCommentsGetter', () => {
  test.each([
    ['options', undefined, new TypeError("Cannot destructure property 'organization' of 'undefined' as it is undefined.")],
    ['options.organization', { project: 'proj' }, new TypeError('The "organization" property of the options is not defined')],
    ['options.project', { organization: 'org' }, new TypeError('The "project" property of the options is not defined')]
  ])('requires %s', function requiresParameters (testName, input, error) {
    const fn = () => createUserStoryCommentsGetter(input)
    expect(fn).toThrow(error)
  })

  test('requires fetch', () => {
    const options = createOptions()
    const fn = () => createUserStoryCommentsGetter(options, undefined)
    expect(fn).toThrow(new ReferenceError('"fetch" is not defined'))
  })

  test('returns a function', () => {
    const options = createOptions()
    const fetch = jest.fn()
    const fn = createUserStoryCommentsGetter(options, fetch)
    expect(fn).toBeInstanceOf(Function)
  })
})

function createOptions () {
  return { organization: 'org', project: 'proj', url: 'https://devops' }
}

function createFetchSub () {
  return jest.fn().mockName('fetchStub')
}

describe('getUserStoryComments', () => {
  test.each([
    ['undefined', undefined, new ReferenceError('"id" is not defined')],
    ['string', '1', new TypeError('"id" is not an integer')],
    ['double', 1.5, new TypeError('"id" is not an integer')]
  ])('requires id (%s)', async function requiresId (testName, input, error) {
    const getUserStoryComments = createUserStoryCommentsGetter(createOptions(), createFetchSub())
    const fn = () => getUserStoryComments(input)
    return expect(fn).rejects.toThrow(error)
  })
})
