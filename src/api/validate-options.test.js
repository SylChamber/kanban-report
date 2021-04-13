const validateOptions = require('./validate-options')

describe('validateOptions', () => {
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
    test(`validates ${testName}`, () => {
      const fn = () => validateOptions(input)
      expect(fn).toThrow(error)
    })
  })

  test('replaces url by default if undefined', () => {
    const options = { organization: 'org', project: 'proj', fetch: function () {} }
    const actual = validateOptions(options)
    const expected = { url: 'https://dev.azure.com' }
    expect(actual).toEqual(expect.objectContaining(expected))
  })

  test('returns the options', () => {
    const options = { organization: 'org', project: 'proj', url: 'https://devops', fetch: function () {} }
    const actual = validateOptions(options)
    expect(actual).toEqual(options)
  })
})
