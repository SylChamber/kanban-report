/**
 * Validates the specified options for Azure DevOps REST API.
 * @param {AzureDevOpsOptions} options - Options for the Azure DevOps REST API.
 * @returns {AzureDevOpsOptions} The validated options and some defaults if not provided.
 */
function validateOptions ({ organization, project, fetch, url }) {
  if (organization === undefined) {
    throw new TypeError('The "organization" property is not defined.')
  }

  if (organization === '') {
    throw new TypeError('The "organization" property is empty.')
  }

  if (project === undefined) {
    throw new TypeError('The "project" property is not defined.')
  }

  if (project === '') {
    throw new TypeError('The "project" property is empty.')
  }

  if (fetch === undefined) {
    throw new TypeError('The "fetch" property is not defined.')
  }

  if (typeof fetch !== 'function') {
    throw new TypeError('The "fetch" property is not a function.')
  }

  if (url === '') {
    throw new TypeError('The "url" property is empty.')
  }

  return { ...arguments[0], url: url ?? 'https://dev.azure.com' }
}

/**
 * @typedef {import('../api/create-azure-devops-client').AzureDevOpsOptions} AzureDevOpsOptions
 */

module.exports = validateOptions
