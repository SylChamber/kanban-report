import createAzureDevopsClientFactory from './src/api/create-azure-devops-client.js'
import fetch from 'node-fetch'

/**
 * Gets an Azure DevOps client.
 * @param {AzureDevopsClientOptions} options - Options for getting an Azure DevOps client.
 * @returns {AzureDevopsClient} An Azure DevOps client.
 */
export default function getAzureDevopsClient (options) {
  return createAzureDevopsClientFactory(fetch)(options)
}

/**
 * @typedef {import('./src/api/create-azure-devops-client').AzureDevopsClientOptions} AzureDevopsClientOptions
 * @typedef {import('./src/api/create-azure-devops-client').AzureDevopsClient} AzureDevopsClient
 */

// import getClient from 'kanban-report/index.js'

// const stdout = process.stdout
// const env = process.env

// const options = {
//   organization: env.AZURE_DEVOPS_ORG,
//   personalAccessToken: env.AZURE_DEVOPS_EXT_PAT,
//   project: env.AZURE_DEVOPS_PROJECT
// }
// const team = env.AZURE_DEVOPS_TEAM

// const client = getClient(options)
// const members = await client.getTeamMembers(team)

// stdout.write(JSON.stringify(members))
 