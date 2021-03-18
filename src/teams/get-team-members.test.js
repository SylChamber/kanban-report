import { assert } from 'chai'
import { getTeamMembers } from './get-team-members.js'

suite('teams', function () {
  suite('getTeamMembers', function () {
    test('function exists', function () {
      assert.isFunction(getTeamMembers)
    })

    test('calls API client', async function () {
      const client = createApiClientStub()
      const getMembers = getTeamMembers(client)
      const project = 'Project'
      const team = 'Team'
      await getMembers(project, team)
      assert.isTrue(client.wasCalledWith(project, team))
    })

    test('maps member identities to persons', async function () {
      const expected = [
        {
          name: 'John Doe',
          email: 'john.doe@example.com'
        }
      ]
      const client = createApiClientStub()
      client.setResponse({
        value: [
          {
            identity: {
              displayName: expected[0].name,
              uniqueName: expected[0].email
            }
          }
        ],
        count: 1
      })
      const getMembers = getTeamMembers(client)
      const options = {
        project: 'Project',
        team: 'Team'
      }
      const realMembers = await getMembers(options.project, options.team)
      assert.deepEqual(realMembers, expected)
    })

    function createApiClientStub () {
      const calls = []
      let response = {
        value: [],
        count: 0
      }

      return {
        async getTeamMembersWithExtendedProperties (project, team) {
          calls.push({
            project: project,
            team: team
          })

          return new Promise((resolve, reject) => {
            resolve(response)
          })
        },

        setResponse (data) {
          response = data
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
