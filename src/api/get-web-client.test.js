import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as azdev from 'azure-devops-node-api'
import getWebClient from './get-web-client.js'

suite('api', function () {
  suiteSetup(function () {
    chai.use(chaiAsPromised)
  })

  suite('getWebClient', function () {
    test('function exists', function () {
      assert.isFunction(getWebClient)
    })

    test('requires an organization', function () {
      const promise = getWebClient({ personalAccessToken: 'token' })
      return assert.isRejected(promise)
    })

    test('requires a personal access token', function () {
      const promise = getWebClient({ organization: 'Org' })
      return assert.isRejected(promise)
    })

    // eslint-disable-next-line mocha/no-skipped-tests
    suite.skip('integration with Azure DevOps', function () {
      let orgUrl
      let tokenHandler

      suiteSetup(function () {
        const personalAccessToken = process.env.AZURE_DEVOPS_EXT_PAT
        const org = process.env.AZURE_DEVOPS_ORG
        orgUrl = `https://dev.azure.com/${org}`
        tokenHandler = azdev.getPersonalAccessTokenHandler(personalAccessToken)
      })

      test('can get client for WorkItemTrackingApi', function () {
        const webClient = new azdev.WebApi(orgUrl, tokenHandler)
        const promise = webClient.getWorkItemTrackingApi()
        return assert.isFulfilled(promise)
      })

      test('can get client for CoreApi', function () {
        const webClient = new azdev.WebApi(orgUrl, tokenHandler)
        const promise = webClient.getCoreApi()
        return assert.isFulfilled(promise)
      })

      test('can get team members', async function () {
        const webClient = new azdev.WebApi(orgUrl, tokenHandler)
        const coreClient = await webClient.getCoreApi()
        const project = process.env.AZURE_DEVOPS_PROJECT
        const team = process.env.AZURE_DEVOPS_TEAM
        const promise = coreClient.getTeamMembersWithExtendedProperties(project, team)
        assert.isFulfilled(promise)
        return assert.eventually.isNotEmpty(promise)
      })
    })
  })
})
