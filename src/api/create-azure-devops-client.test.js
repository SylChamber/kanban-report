const fetch = require('node-fetch')
const createAzureDevopsClientFactory = require('./create-azure-devops-client')

describe('createAzureDevopsClientFactory', function () {
  test('requires fetch', function () {
    const fn = () => createAzureDevopsClientFactory()
    expect(fn).toThrow(new ReferenceError('"fetch" is not defined'))
  })

  test('returns function to get client', function () {
    const fetchStub = {}
    const client = createAzureDevopsClientFactory(fetchStub)
    expect(client).toBeInstanceOf(Function)
  })
})

describe('createAzureDevopsClient', function () {
  test('requires options', function () {
    const fn = () => createAzureDevopsClientFactory({})()
    expect(fn).toThrow(new ReferenceError('"options" is not defined'))
  })

  test('requires organization', function () {
    const options = { project: 'proj', personalAccessToken: 'token', url: 'https://devops' }
    const fn = opt => createAzureDevopsClientFactory({})(options)
    expect(fn).toThrow(new TypeError('The "options.organization" property is not defined'))
  })

  test('requires project', function () {
    const options = { organization: 'org', personalAccessToken: 'token', url: 'https://devops' }
    const fn = opt => createAzureDevopsClientFactory({})(options)
    expect(fn).toThrow(new TypeError('The "options.project" property is not defined'))
  })

  test('requires personal access token', function () {
    const options = { organization: 'org', project: 'proj', url: 'https://devops' }
    const fn = opt => createAzureDevopsClientFactory({})(options)
    expect(fn).toThrow(new TypeError('The "options.personalAccessToken" property is not defined'))
  })

  test('requires url', () => {
    const options = { organization: 'org', personalAccessToken: 'token', project: 'proj' }
    const fn = opt => createAzureDevopsClientFactory({})(options)
    expect(fn).toThrow(new TypeError('The "options.url" property is not defined'))
  })
})

describe('AzureDevopsClient', function () {
  test('exposes getTeamMembers', function () {
    const options = {
      organization: 'org',
      project: 'project',
      personalAccessToken: 'token',
      url: 'https://devops'
    }
    const client = createAzureDevopsClientFactory(function () {})(options)
    expect(client).toHaveProperty('getTeamMembers')
    expect(client.getTeamMembers).toBeInstanceOf(Function)
  })

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('integration with Azure', function () {
    test('client can access Azure DevOps', async function () {
      const options = {
        organization: process.env.AZURE_DEVOPS_ORG,
        project: process.env.AZURE_DEVOPS_PROJECT,
        personalAccessToken: process.env.AZURE_DEVOPS_EXT_PAT,
        url: process.env.AZURE_DEVOPS_URL
      }
      const team = process.env.AZURE_DEVOPS_TEAM
      const client = createAzureDevopsClientFactory(fetch)(options)
      const members = await client.getTeamMembers(team)
      expect(members).toBeInstanceOf(Array)
      expect(members).not.toHaveLength(0)
    })
  })
})
