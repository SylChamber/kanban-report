const createAzureDevopsClient = require('./create-azure-devops-client')

describe('createAzureDevopsClient', function () {
  [
    ['options (undefined)', undefined, new ReferenceError("Cannot destructure property 'accessToken' of 'undefined' as it is undefined.")],
    ['accessToken (undefined)', {}, new TypeError('The "accessToken" property is not defined.')],
    ['organization (undefined)', { accessToken: 'token' }, new TypeError('The "organization" property is not defined.')],
    ['organization (empty)', { accessToken: 'token', organization: '' }, new TypeError('The "organization" property is empty.')],
    ['project (undefined)', { accessToken: 'token', organization: 'org' }, new TypeError('The "project" property is not defined.')],
    ['project (empty)', { accessToken: 'token', organization: 'org', project: '' }, new TypeError('The "project" property is empty.')],
    ['url (empty)', { accessToken: 'token', organization: 'org', project: 'proj', url: '' }, new TypeError('The "url" property is empty.')]
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
      accessToken: 'token',
      organization: 'org',
      project: 'project',
      url: 'https://devops'
    }
    const client = createAzureDevopsClient(options)
    expect(client).toHaveProperty('getTeamMembers')
    expect(client.getTeamMembers).toBeInstanceOf(Function)
  })

  test('exposes getCurrentUserStories', () => {
    const options = {
      accessToken: 'token',
      organization: 'org',
      project: 'proj',
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
        accessToken: process.env.AZURE_DEVOPS_EXT_PAT,
        organization: process.env.AZURE_DEVOPS_ORG,
        project: process.env.AZURE_DEVOPS_PROJECT,
        url: process.env.AZURE_DEVOPS_URL
      }
      const team = process.env.AZURE_DEVOPS_TEAM
      const client = createAzureDevopsClient(options)
      const members = await client.getTeamMembers(team)
      expect(members).toBeInstanceOf(Array)
      expect(members).not.toHaveLength(0)
    })
  })
})
