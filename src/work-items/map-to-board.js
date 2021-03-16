/**
 * Represents a Work Item returned from Azure DevOps.
 * @typedef {Object} WorkItem
 * @property {WorkItemFields} fields - Fields of the work item.
 */

/**
 * Object that encapsulates the fields of a work item in Azure DevOps.
 * @typedef {Object} WorkItemFields
 * @property {string} "System.BoardColumn" - Column of the item on the board.
 * @property {boolean} "System.BoardColumnDone" - Subcolumn Done of the item on the board.
 * @property {string} "System.BoardLane" - Lane of the item on the board.
 */

/**
 * Represent the location of a work item on the Azure DevOps board.
 * @typedef {Object} BoardLocation
 * @property {string} column - Column of the item on the board.
 * @property {boolean} [columnDone] - Subcolumn Done of the item on the board.
 * @property {string} [lane] - Lane of the item on the board.
 */

/**
 * Maps a work item to a BoardLocation object.
 * @param {WorkItem} item - Work item to map to a Board object.
 * @returns {BoardLocation} The location of the item on the board.
 */
export default function mapToBoard (item) {
  const columnKey = 'System.BoardColumn'
  const column = {
    column: item.fields[columnKey]
  }
  let columnDone

  if (item.fields[`${columnKey}Done`]) {
    columnDone = {
      columnDone: item.fields[`${columnKey}Done`]
    }
  }

  return Object.assign({}, column, columnDone)
}
