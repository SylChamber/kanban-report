const fetch = require('node-fetch')
const createAzureDevopsClient = require('./create-azure-devops-client')

describe('createAzureDevopsClient', function () {
  [
    ['options (undefined)', undefined, new ReferenceError("Cannot destructure property 'organization' of 'undefined' as it is undefined.")],
    ['organization (undefined)', { project: 'proj' }, new TypeError('The "organization" property is not defined.')],
    ['organization (empty)', { organization: '', project: 'proj' }, new TypeError('The "organization" property is empty.')],
    ['project (undefined)', { organization: 'org' }, new TypeError('The "project" property is not defined.')],
    ['project (empty)', { organization: 'org', project: '' }, new TypeError('The "project" property is empty.')],
    ['fetch (undefined)', { organization: 'org', project: 'proj' }, new TypeError('The "fetch" property is not defined.')],
    ['fetch (not a function)', { organization: 'org', project: 'proj', fetch: {} }, new TypeError('The "fetch" property is not a function.')],
    ['url (empty)', { organization: 'org', project: 'proj', fetch: jest.fn(), url: '' }, new TypeError('The "url" property is empty.')]
  ].forEach(([testName, input, error]) => {
    test(`requires ${testName}`, () => {
      const fn = () => createAzureDevopsClient(input)
      expect(fn).toThrow(error)
    })
  })
})

describe('AzureDevopsClient', function () {
  test('exposes getTeamMembers', function () {
    const options = {
      organization: 'org',
      project: 'project',
      fetch: jest.fn(),
      url: 'https://devops'
    }
    const client = createAzureDevopsClient(options)
    expect(client).toHaveProperty('getTeamMembers')
    expect(client.getTeamMembers).toBeInstanceOf(Function)
  })

  test('exposes getCurrentUserStories', () => {
    const options = {
      organization: 'org',
      project: 'proj',
      fetch: jest.fn(),
      url: 'https://devops'
    }
    const client = createAzureDevopsClient(options)
    expect(client).toHaveProperty('getCurrentUserStories')
    expect(client.getCurrentUserStories).toBeInstanceOf(Function)
  })

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('integration with Azure', function () {
    test('client can access Azure DevOps', async function () {
      const options = {
        organization: process.env.AZURE_DEVOPS_ORG,
        project: process.env.AZURE_DEVOPS_PROJECT,
        url: process.env.AZURE_DEVOPS_URL,
        fetch
      }
      const team = process.env.AZURE_DEVOPS_TEAM
      const client = createAzureDevopsClient(options)
      const members = await client.getTeamMembers(team)
      expect(members).toBeInstanceOf(Array)
      expect(members).not.toHaveLength(0)
    })
  })
})
