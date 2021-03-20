import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sortBy from 'lodash/fp/sortBy.js'
import createTeamMembersGetter from './get-team-members.js'

suite('api', function () {
  suiteSetup(function () {
    chai.use(chaiAsPromised)
  })
  suite('createTeamMembersGetter', function () {
    test('requires options', function () {
      const fn = () => createTeamMembersGetter(undefined, {})
      assert.throws(fn, ReferenceError, '"options" is not defined')
    })

    test('requires options.organization', function () {
      const options = { personalAccessToken: 'token', project: 'proj' }
      const fn = () => createTeamMembersGetter(options, {})
      assert.throws(fn, TypeError, 'The "options.organization" property is not defined')
    })

    test('requires options.project', function () {
      const options = { organization: 'org', personalAccessToken: 'token' }
      const fn = () => createTeamMembersGetter(options, {})
      assert.throws(fn, TypeError, 'The "options.project" property is not defined')
    })

    test('requires options.personalAccessToken', function () {
      const options = { organization: 'org', project: 'proj' }
      const fn = () => createTeamMembersGetter(options, {})
      assert.throws(fn, TypeError, 'The "options.personalAccessToken" property is not defined')
    })

    test('requires fetch', function () {
      const options = { organization: 'org', personalAccessToken: 'token', project: 'proj' }
      const fn = () => createTeamMembersGetter(options)
      assert.throws(fn, ReferenceError, '"fetch" is not defined')
    })

    test('returns a function', function () {
      const options = { organization: 'org', personalAccessToken: 'token', project: 'proj' }
      const fn = createTeamMembersGetter(options, {})
      assert.isFunction(fn)
    })
  })

  suite('getTeamMembers', function () {
    test('requires team', function () {
      const fetch = createFetchStub().fetch
      const getTeamMembers = createTeamMembersGetter(options, fetch)
      const promise = getTeamMembers()
      return assert.isRejected(promise, ReferenceError, '"team" is not defined')
    })

    test('calls fetch with right headers', async function () {
      const fetchStub = createFetchStub()
      const team = 'teamd'
      const expected = {
        url: `https://dev.azure.com/${options.organization}/_apis/projects/${options.project}/teams/${team}/members`,
        options: {
          headers: {
            Authorization: `Basic ${Buffer.from(`:${options.personalAccessToken}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      }
      fetchStub.setExpectedCall(expected)
      const getTeamMembers = createTeamMembersGetter(options, fetchStub.fetch)
      await getTeamMembers(team)
      const fetchWasCalled = fetchStub.wasCalledWith(expected.url, expected.options)
      assert.isTrue(fetchWasCalled, fetchStub.getErrorMessage())
    })

    test('returns members mapped to persons', async function () {
      const sortByName = sortBy('name')
      const fetchStub = createFetchStub()
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
      const getTeamMembers = createTeamMembersGetter(options, fetchStub.fetch)
      const result = await getTeamMembers(team)
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
      const getTeamMembers = createTeamMembersGetter(options, fetchStub.fetch)
      const result = await getTeamMembers(team)
      assert.strictEqual(
        result.length,
        expected.length,
        `Unexpected number of persons returned:\n${JSON.stringify(result)}`)
      const sortedResult = sortByName(result)
      expected.forEach((person, index) => {
        assert.deepEqual(sortedResult[index], person)
      })
    })

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

    const options = {
      organization: 'org',
      project: 'proj',
      personalAccessToken: 'token'
    }
  })
})
