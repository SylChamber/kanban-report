import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { getTeamMembers } from './get-team-members.js'

suite('teams', function () {
  suiteSetup(function () {
    chai.use(chaiAsPromised)
  })

  suite('getTeamMembers', function () {
    test('function exists', function () {
      assert.isFunction(getTeamMembers)
    })

    test('calls API client', async function () {
      const client = createApiClientStub()
      const getMembers = getTeamMembers(client)
      const options = {
        project: 'Project',
        team: 'Team'
      }
      await getMembers(options)
      assert.isTrue(client.wasCalledWith(options.project, options.team))
    })

    test('requires project', function () {
      const client = createApiClientStub()
      const getMembers = getTeamMembers(client)
      const promise = getMembers({ team: 'Team' })
      return assert.isRejected(promise)
    })

    test('requires team', function () {
      const client = createApiClientStub()
      const getMembers = getTeamMembers(client)
      const promise = getMembers({ project: 'Project' })
      return assert.isRejected(promise)
    })

    test('maps member identities to persons', async function () {
      const expected = [
        {
          name: 'John Doe',
          email: 'john.doe@example.com'
        }
      ]
      const client = createApiClientStub()
      client.addIdentity({
        displayName: expected[0].name,
        uniqueName: expected[0].email
      })
      const getMembers = getTeamMembers(client)
      const options = {
        project: 'Project',
        team: 'Team'
      }
      const realMembers = await getMembers(options)
      assert.deepEqual(realMembers, expected)
    })

    /**
     * @typedef {import('./get-team-members').CoreApi} CoreApi
     * @typedef {import('./map-to-person').Identity} Identity
     * @typedef {import('./get-team-members').TeamMembersOptions} TeamMembersOptions
     */

    /**
     * @typedef {object} ClientStub
     * @property {TeamMembersOptions[]} calls - Parameters of the calls to the stub.
     * @property {function(Identity)} addIdentity - Adds an identity to the response.
     * @property {function(string, string): boolean} wasCalledWith - Determines if a call was made to the stub with the specified arguments.
     */

    /**
     * Creates a stub of the Azure DevOps Core API client.
     * @returns {CoreApi & ClientStub} Stub of the Azure DevOps Core API client.
     */
    function createApiClientStub () {
      const calls = []
      const response = []

      return {
        calls () {
          return calls
        },

        async getTeamMembersWithExtendedProperties (project, team) {
          calls.push({
            project: project,
            team: team
          })

          return new Promise((resolve, reject) => {
            resolve(response)
          })
        },

        addIdentity (identity) {
          response.push({ identity: identity })
        },

        wasCalledWith (project, team) {
          const callEquals = this.callEqualsFn(project, team)
          return calls.some(callEquals)
        },

        callEqualsFn (project, team) {
          return function (call) {
            return call.project === project && call.team === team
          }
        }
      }
    }
  })
})
