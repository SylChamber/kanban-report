import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fetch from 'node-fetch'
import sortBy from 'lodash/fp/sortBy.js'
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
        const options = { project: 'proj', personalAccessToken: 'token' }
        const fn = opt => getAzureDevopsClient({})(options)
        assert.throws(fn, TypeError, 'The "organization" property is not defined')
      })

      test('requires project', function () {
        const options = { organization: 'org', personalAccessToken: 'token' }
        const fn = opt => getAzureDevopsClient({})(options)
        assert.throws(fn, TypeError, 'The "project" property is not defined')
      })

      test('requires personal access token', function () {
        const options = { organization: 'org', project: 'proj' }
        const fn = opt => getAzureDevopsClient({})(options)
        assert.throws(fn, TypeError, 'The "personalAccessToken" property is not defined')
      })

      suite('Azure DevOps client', function () {
        suite('getTeamMembers', function () {
          test('requires team', function () {
            const client = createClient(createFetchStub().fetch)
            const promise = client.getTeamMembers()
            return assert.isRejected(promise, ReferenceError, '"team" is not defined')
          })

          test('calls fetch with right headers', async function () {
            const fetchStub = createFetchStub()
            const client = createClient(fetchStub.fetch)
            const team = 'teamd'
            const expected = {
              url: `https://dev.azure.com/${clientOptions.organization}/_apis/projects/${clientOptions.project}/teams/${team}/members`,
              options: {
                headers: {
                  Authorization: `Basic ${Buffer.from(`:${clientOptions.personalAccessToken}`).toString('base64')}`,
                  'Content-Type': 'application/json'
                }
              }
            }
            fetchStub.setExpectedCall(expected)
            await client.getTeamMembers(team)
            const fetchWasCalled = fetchStub.wasCalledWith(expected.url, expected.options)
            assert.isTrue(fetchWasCalled, fetchStub.getErrorMessage())
          })

          test('returns members mapped to persons', async function () {
            const sortByName = sortBy('name')
            const fetchStub = createFetchStub()
            const client = createClient(fetchStub.fetch)
            const team = 'teamd'
            const returnedData = {
              value: [
                { identity: { displayName: 'John Doe', uniqueName: 'john.doe@example.com' } },
                { identity: { displayName: 'Sam Adams', uniqueName: 'sam.adams@samadams.com' } }
              ],
              count: 2
            }
            const expected = [
              { name: 'John Doe', email: 'john.doe@example.com' },
              { name: 'Sam Adams', email: 'sam.adams@samadams.com' }
            ]
            fetchStub.setReturnedData(returnedData)
            const result = await client.getTeamMembers(team)
            assert.isArray(result, `expected an array of persons but got:\n${JSON.stringify(result)}\n\n`)
            const sortedResult = sortByName(result)
            expected.forEach((person, index) => {
              assert.deepEqual(sortedResult[index], person)
            })
            assert.strictEqual(result.length, expected.length, 'Unexpected number of persons returned')
          })

          test('returns persons only and discards groups', async function () {
            const sortByName = sortBy('name')
            const fetchStub = createFetchStub()
            const client = createClient(fetchStub.fetch)
            const team = 'teamA'
            const returnedData = {
              value: [
                { identity: { displayName: 'John Doe', uniqueName: 'john.doe@example.com' } },
                {
                  identity: {
                    displayName: 'Superteam',
                    uniqueName: 'vstfs:///Framework/IdentityDomain/[GUID]/\\Superteam',
                    isContainer: true
                  }
                }
              ],
              count: 2
            }
            const expected = [{ name: 'John Doe', email: 'john.doe@example.com' }]
            fetchStub.setReturnedData(returnedData)
            const result = await client.getTeamMembers(team)
            assert.strictEqual(
              result.length,
              expected.length,
              `Unexpected number of persons returned:\n${JSON.stringify(result)}`)
            const sortedResult = sortByName(result)
            expected.forEach((person, index) => {
              assert.deepEqual(sortedResult[index], person)
            })
          })
        })

        // eslint-disable-next-line mocha/no-skipped-tests
        suite.skip('integration with Azure', function () {
          test('client can access Azure DevOps', async function () {
            const options = {
              organization: process.env.AZURE_DEVOPS_ORG,
              project: process.env.AZURE_DEVOPS_PROJECT,
              personalAccessToken: process.env.AZURE_DEVOPS_EXT_PAT
            }
            const team = process.env.AZURE_DEVOPS_TEAM
            const client = getAzureDevopsClient(fetch)(options)
            const members = await client.getTeamMembers(team)
            assert.isNotEmpty(members)
          })
        })

        function createClient (fetch) {
          return getAzureDevopsClient(fetch)(clientOptions)
        }

        function createFetchStub () {
          const response = {
            ok: true,
            status: 200,
            statusText: 'OK',
            async json () { return new Promise(resolve => resolve(returnedData)) }
          }
          let returnedData = { value: [], count: 0 }
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
                resolve(response)
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

            setExpectedCall (call) {
              expectedCall = call
            },

            setReturnedData (data) {
              returnedData = data
            },

            setReturnedState (state) {
              Object.assign(response, state)
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

        const clientOptions = {
          organization: 'org',
          project: 'proj',
          personalAccessToken: 'token'
        }
      })
    })
  })
})
