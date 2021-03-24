const decorateFetchWithOptions = require('./decorate-fetch-with-options')

describe('decorateFetchWithOptions', () => {
  test.each([
    ['undefined', undefined],
    ['empty string', '']
  ])('requires personal access token (%s)', function requiresPersonalAccessToken (testName, token) {
    const fetch = jest.fn()
    const fn = () => decorateFetchWithOptions(fetch, token)
    expect(fn).toThrow(new ReferenceError('"personalAccessToken" is not defined'))
  })

  test.each([
    ['undefined', undefined, new ReferenceError('"fetch" is not defined')],
    ['not a function', {}, new TypeError('"fetch" is not a function')]
  ])('requires fetch function (%s)', function requiresFetchFunction (testName, fetch, error) {
    const fn = () => decorateFetchWithOptions(fetch, 'token')
    expect(fn).toThrow(error)
  })

  test('returns a function', () => {
    const decoratedFetch = decorateFetchWithOptions(jest.fn(), 'token')
    expect(decoratedFetch).toBeInstanceOf(Function)
  })
})

describe('decoratedFetch', () => {
  test('requires url', () => {
    const fetch = jest.fn().mockName('fetchMock')
    const decoratedFetch = decorateFetchWithOptions(fetch, 'token')
    const fn = () => decoratedFetch()
    return expect(fn).rejects.toThrow(new ReferenceError('"url" is not defined'))
  })

  test('calls the inner fetch with right url', async () => {
    const fetch = jest.fn().mockName('fetchMock')
    const decoratedFetch = decorateFetchWithOptions(fetch, 'token')
    const url = 'https://example.com'
    await decoratedFetch(url)
    expect(fetch).toHaveBeenCalledWith(url, expect.anything())
  })

  test.each([
    ['no options', undefined],
    ['existing headers', { headers: { 'Content-Type': 'application/json' } }],
    ['existing options', { method: 'GET' }]
  ])('calls the inner fetch with the right options (%s)',
    async function callsInnerFetchWithRightOptions (testName, options) {
      const fetch = jest.fn().mockName('fetchMock')
      const token = 'token'
      const expectedHeaders = {
        Accept: 'application/json; api-version=6.0',
        Authorization: `Basic ${Buffer.from(`:${token}`).toString('base64')}`
      }
      const expectedOptions = { ...options, headers: { ...options?.headers, ...expectedHeaders } }
      const decoratedFetch = decorateFetchWithOptions(fetch, token)
      decoratedFetch('https://example.com', options)
      expect(fetch).toHaveBeenCalledWith(expect.anything(), expectedOptions)
    })
})
