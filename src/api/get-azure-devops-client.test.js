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
  })

  suite('Azure DevOps client', function () {
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
  })
})
