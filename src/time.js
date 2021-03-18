import subBusinessDays from 'date-fns/fp/subBusinessDays/index.js'

/**
 * Gets the work day preceding the date of reference.
 * @param {Date} referenceDate - Reference date for which the previous work day is required.
 * @returns {Date} The previous work day.
 */
function getPreviousWorkday (referenceDate) {
  return subBusinessDays(1)(referenceDate)
}

export { getPreviousWorkday }
