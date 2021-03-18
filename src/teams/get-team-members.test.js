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

    function createApiClientStub () {
      const calls = []
      const response = []

      return {
        async getTeamMembersWithExtendedProperties (project, team) {
          calls.push({
            project: project,
            team: team
          })

          return new Promise((resolve, reject) => {
            resolve([])
          })
        },

        setResponse (data) {
          response.push(...data)
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
