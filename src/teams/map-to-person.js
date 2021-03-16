/**
 * Represents an identity in Azure DevOps.
 * @typedef {Object} Identity
 * @property {string} displayName - Full name of the person.
 * @property {string} uniqueName - Unique name of the identity; usually the email.
 */

/**
 * @typedef {Object} Person
 * @property {string} name - Full name of the person.
 * @property {string} email - Email of the person.
 */

/**
 * Maps an identity from Azure DevOps to a Person object.
 * @param {Identity} identity Identity to map to a Person object.
 * @returns {Person} Object that represents a person.
 */
export default function mapToPerson (identity) {
  if (!identity) {
    return
  }

  return {
    name: identity.displayName,
    email: identity.uniqueName
  }
}
