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

    // eslint-disable-next-line mocha/no-setup-in-describe
    createWebApiSamples().forEach(function (sample) {
      test(`requires the azdev API (${sample.name})`, function () {
        const fn = () => getWebClient(sample.api)
        assert.throws(fn, sample.errorType, sample.errorMessage)
      })
    })

    test('returns a function that gets the web client', function () {
      const getWebClientfn = getWebClient({
        getCoreApi: function () {},
        getWorkItemTrackingApi: function () {}
      })
      assert.isFunction(getWebClientfn)
    })

    function createWebApiSamples () {
      return [
        {
          name: 'undefined',
          api: undefined,
          errorType: ReferenceError,
          errorMessage: '"webApi" is not defined'
        },
        {
          name: 'getCoreApi missing',
          api: { async getWorkItemTrackingApi () {} },
          errorType: TypeError,
          errorMessage: 'The "getCoreApi" property is undefined'
        },
        {
          name: 'getWorkItemTrackingApi missing',
          api: { async getCoreApi () {} },
          errorType: TypeError,
          errorMessage: 'The "getWorkItemTrackingApi" property is undefined'
        }
      ]
    }

    suite('returned function', function () {
      test('requires an organization', function () {
        const fn = () => getWebClient(createAzdevApiStub())({ personalAccessToken: 'token' })
        assert.throws(fn, TypeError, 'The "organization" property is undefined')
      })

      test('requires a personal access token', function () {
        const fn = () => getWebClient(createAzdevApiStub())({ organization: 'Org' })
        assert.throws(fn, TypeError, 'The "personalAccessToken" property is undefined')
      })

      test('returns a client that allows access to Azure DevOps APIs', function () {
        const options = { organization: 'org', personalAccessToken: 'token' }
        const client = getWebClient(createAzdevApiStub())(options)
        assert.isDefined(client)
        assertExposesCoreApi(client)
        assertExposesWorkItemTrackingApi(client)

        function assertExposesCoreApi (webClient) {
          assertExposesApi(webClient, 'getCoreApi')
        }

        function assertExposesWorkItemTrackingApi (webClient) {
          assertExposesApi(webClient, 'getWorkItemTrackingApi')
        }

        function assertExposesApi (webClient, apiFunctionName) {
          assert.property(webClient, apiFunctionName)
          assert.isDefined(webClient[apiFunctionName])
          assert.isFunction(webClient[apiFunctionName])
        }
      })

      function createAzdevApiStub () {
        return {
          getCoreApi: function () {},
          getWorkItemTrackingApi: function () {}
        }
      }

      // eslint-disable-next-line mocha/no-skipped-tests
      suite.skip('integration with Azure', function () {
        let webClientOptions
        let webApi

        suiteSetup(function () {
          webClientOptions = {
            organization: process.env.AZURE_DEVOPS_ORG,
            personalAccessToken: process.env.AZURE_DEVOPS_EXT_PAT
          }
          const tokenHandler = azdev.getPersonalAccessTokenHandler(webClientOptions.personalAccessToken)
          const orgUrl = `https://dev.azure.com/${webClientOptions.organization}`
          webApi = new azdev.WebApi(orgUrl, tokenHandler)
        })
        suite('getCoreApi', function () {
          test('can get team members', async function () {
            const teamOptions = {
              project: process.env.AZURE_DEVOPS_PROJECT,
              team: process.env.AZURE_DEVOPS_TEAM
            }
            const webClient = getWebClient(webApi)(webClientOptions)
            const coreClient = await webClient.getCoreApi()
            const members = await coreClient.getTeamMembersWithExtendedProperties(teamOptions)
            assert.isNotEmpty(members)
          })
        })
      })
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
        const webApi = new azdev.WebApi(orgUrl, tokenHandler)
        const promise = webApi.getWorkItemTrackingApi()
        promise.then(function (witClient) {
          console.log(Object.keys(witClient))
        })
        return assert.isFulfilled(promise)
      })

      test('can get client for CoreApi', function () {
        const webApi = new azdev.WebApi(orgUrl, tokenHandler)
        const promise = webApi.getCoreApi()
        return assert.isFulfilled(promise)
      })

      test('can get team members', async function () {
        const webApi = new azdev.WebApi(orgUrl, tokenHandler)
        const coreApi = await webApi.getCoreApi()
        const project = process.env.AZURE_DEVOPS_PROJECT
        const team = process.env.AZURE_DEVOPS_TEAM
        const response = await coreApi.getTeamMembersWithExtendedProperties(project, team)
        console.log('getTeamMembers* response:', response)
        assert.isNotEmpty(response)
      })
    })
  })
})
