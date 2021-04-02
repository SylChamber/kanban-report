const { differenceInBusinessDays, subBusinessDays } = require('date-fns/fp')

/**
 * Gets the work day preceding the date of reference.
 * @param {Date} referenceDate - Reference date for which the previous work day is required.
 * @returns {Date} The previous work day.
 */
function getPreviousWorkday (referenceDate) {
  return subBusinessDays(1)(referenceDate)
}

/**
 * Gets the difference in business days between two dates.
 * @param {Date} laterDate - Later date to subtract from.
 * @param {Date} earlierDate - Earlier date to subtract.
 * @returns {number} Number of business days between the two dates.
 */
function getDifferenceInBusinessDays (laterDate, earlierDate) {
  return differenceInBusinessDays(earlierDate)(laterDate)
}

/**
 * Returns a function that indicates if a comment was created or modified on or since the specified date.
 * @param {Date} referenceDate - Date to compare the comment to.
 * @returns {wasCreatedOrModifiedOnOrSinceDate} Function that compares the creation and modification dates of a comment to a reference date.
 */
function wasCreatedOrModifiedOnOrSince (referenceDate) {
  return wasCreatedOrModifiedOnOrSinceDate
  /**
   * Indicates if a comment was created or modified on or since the specified date.
   * @param {{createdDate: Date, modifiedDate: Date}} comment - Comment to compare dates to.
   * @returns {Boolean} True if the comment was created or modified on or since the specified date; or else returns false.
   */
  function wasCreatedOrModifiedOnOrSinceDate ({ createdDate, modifiedDate }) {
    return createdDate >= referenceDate || modifiedDate >= referenceDate
  }
}

module.exports = {
  getPreviousWorkday,
  getDifferenceInBusinessDays,
  wasCreatedOrModifiedOnOrSince
}
