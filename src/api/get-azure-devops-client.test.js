import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fetch from 'node-fetch'
import getAzureDevopsClient from './get-azure-devops-client.js'

suite('api', function () {
  suiteSetup(function () {
    chai.use(chaiAsPromised)
  })
  suite('getAzureDevopsClient getter', function () {
    test('requires fetch', function () {
      const fn = () => getAzureDevopsClient()
      assert.throws(fn, ReferenceError, '"fetch" is not defined')
    })

    test('returns function to get client', function () {
      const fetchStub = {}
      const client = getAzureDevopsClient(fetchStub)
      assert.isFunction(client)
    })

    suite('getAzureDevopsClient', function () {
      test('requires options', function () {
        const fn = () => getAzureDevopsClient({})()
        assert.throws(fn, ReferenceError, '"options" is not defined')
      })

      test('requires organization', function () {
        const options = { project: 'proj' }
        const fn = opt => getAzureDevopsClient({})(options)
        assert.throws(fn, TypeError, 'The "organization" property is not defined')
      })

      test('requires project', function () {
        const options = { organization: 'org' }
        const fn = opt => getAzureDevopsClient({})(options)
        assert.throws(fn, TypeError, 'The "project" property is not defined')
      })

      suite('result object', function () {
        suite('getTeamMembers', function () {
          test('requires team', function () {
            const client = createClient(createFetchStub().fetch)
            const promise = client.getTeamMembers()
            return assert.isRejected(promise, ReferenceError, '"team" is not defined')
          })

          test('calls fetch', async function () {
            const fetchStub = createFetchStub()
            const client = createClient(fetchStub.fetch)
            const team = 'teamd'
            const expected = {
              url: `https://dev.azure.com/${clientOptions.organization}/_apis/projects/${clientOptions.project}/teams/${team}/members`,
              options: {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            }
            fetchStub.setExpected(expected)
            await client.getTeamMembers(team)
            const fetchWasCalled = fetchStub.wasCalledWith(expected.url, expected.options)
            assert.isTrue(fetchWasCalled, fetchStub.getErrorMessage())
          })
        })

        function createClient (fetch) {
          return getAzureDevopsClient(fetch)(clientOptions)
        }

        function createFetchStub () {
          let res = {}
          const calls = []
          let expectedCall = {}

          return {
            calls () {
              return calls
            },

            async fetch (url, options) {
              calls.push({
                url,
                options
              })

              return new Promise((resolve, reject) => {
                resolve(res)
              })
            },

            getErrorMessage () {
              return `
expected a call to fetch with:
  ${this.formatCall(expectedCall)}
actual calls:  ${calls.length === 0 ? 'none' : ''}
  ${calls.map(this.formatCall)}
`
            },

            formatCall (call) {
              return `
  url: ${call.url}
  options: ${JSON.stringify(call.options)}

  `
            },

            setExpected (expected) {
              expectedCall = expected
            },

            setResponse (response) {
              res = response
            },

            wasCalledWith (url, options) {
              const callEquals = this.callEqualsFn(url, options)
              return calls.some(callEquals)
            },

            callEqualsFn (url, options) {
              return function (call) {
                return call.url === url &&
                  JSON.stringify(call.options) === JSON.stringify(options)
              }
            }
          }
        }

        const clientOptions = { organization: 'org', project: 'proj' }
      })
    })
  })
})
