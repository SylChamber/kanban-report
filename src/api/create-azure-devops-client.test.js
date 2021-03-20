import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fetch from 'node-fetch'
import createAzureDevopsClientFactory from './create-azure-devops-client.js'

suite('api', function () {
  suiteSetup(function () {
    chai.use(chaiAsPromised)
  })
  suite('createAzureDevopsClientFactory', function () {
    test('requires fetch', function () {
      const fn = () => createAzureDevopsClientFactory()
      assert.throws(fn, ReferenceError, '"fetch" is not defined')
    })

    test('returns function to get client', function () {
      const fetchStub = {}
      const client = createAzureDevopsClientFactory(fetchStub)
      assert.isFunction(client)
    })
  })

  suite('createAzureDevopsClient', function () {
    test('requires options', function () {
      const fn = () => createAzureDevopsClientFactory({})()
      assert.throws(fn, ReferenceError, '"options" is not defined')
    })

    test('requires organization', function () {
      const options = { project: 'proj', personalAccessToken: 'token' }
      const fn = opt => createAzureDevopsClientFactory({})(options)
      assert.throws(fn, TypeError, 'The "options.organization" property is not defined')
    })

    test('requires project', function () {
      const options = { organization: 'org', personalAccessToken: 'token' }
      const fn = opt => createAzureDevopsClientFactory({})(options)
      assert.throws(fn, TypeError, 'The "options.project" property is not defined')
    })

    test('requires personal access token', function () {
      const options = { organization: 'org', project: 'proj' }
      const fn = opt => createAzureDevopsClientFactory({})(options)
      assert.throws(fn, TypeError, 'The "options.personalAccessToken" property is not defined')
    })
  })

  suite('AzureDevopsClient', function () {
    // eslint-disable-next-line mocha/no-skipped-tests
    suite.skip('integration with Azure', function () {
      test('client can access Azure DevOps', async function () {
        const options = {
          organization: process.env.AZURE_DEVOPS_ORG,
          project: process.env.AZURE_DEVOPS_PROJECT,
          personalAccessToken: process.env.AZURE_DEVOPS_EXT_PAT
        }
        const team = process.env.AZURE_DEVOPS_TEAM
        const client = createAzureDevopsClientFactory(fetch)(options)
        const members = await client.getTeamMembers(team)
        assert.isNotEmpty(members)
      })
    })
  })
})
