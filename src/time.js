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

module.exports = { getPreviousWorkday, getDifferenceInBusinessDays }
