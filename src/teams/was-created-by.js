/**
 *
 * @param {Person[]} members - Members from which to check the creator of the comment.
 */
function wasCreatedBy (members) {
  if (members === undefined) {
    throw new ReferenceError('"members" is not defined')
  }

  if (!(members instanceof Array)) {
    throw new TypeError('"members" is not an array of persons')
  }

  if (!members.some(isPerson)) {
    throw new TypeError('"members" is not an array of persons')
  }

  return wasCreatedByTeam

  /**
   * Check if an item represents a person.
   * @param {{createdBy:{name:string, email:string}}} item
   * @returns {Boolean} True if the item represents a person; else, false.
   */
  function isPerson (item) {
    const hasOwn = Object.prototype.hasOwnProperty
    return hasOwn.call(item, 'name') &&
      hasOwn.call(item, 'email')
  }

  /**
   * Checks if an item was created by a team member.
   * @param {{createdBy:Person}} item - Item to check if it was created by a team member.
   */
  function wasCreatedByTeam ({ createdBy }) {
    if (createdBy === undefined) {
      throw new TypeError('The "createdBy" property of "item" is not defined.')
    }

    if (!isPerson(createdBy)) {
      throw new TypeError('The "createdBy" property of "item" is not a person object.')
    }

    return members.some(isSameAsCreatedBy)

    /**
     * @param {Person} member
     * @returns {boolean}
     */
    function isSameAsCreatedBy (member) {
      return member.email === createdBy.email && member.name === createdBy.name
    }
  }
}

/**
 * @typedef {import('./get-team-members').Person} Person
 */

module.exports = wasCreatedBy
