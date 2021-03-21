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
 * @property {number} [rank] - Rank of the item on the backlog and the board, represents the priority order.
 */

/**
 * Maps a work item to a BoardLocation object.
 * @param {WorkItem} item - Work item to map to a Board object.
 * @returns {BoardLocation} The location of the item on the board.
 */
function mapToBoard (item) {
  const board = {
    column: item.fields[fieldKeys.column]
  }

  if (item.fields[fieldKeys.columnDone] !== undefined) {
    Object.assign(board, {
      columnDone: item.fields[fieldKeys.columnDone]
    })
  }

  if (item.fields[fieldKeys.lane]) {
    Object.assign(board, {
      lane: item.fields[fieldKeys.lane]
    })
  }

  if (item.fields[fieldKeys.rank]) {
    Object.assign(board, {
      rank: item.fields[fieldKeys.rank]
    })
  }

  return board
}

const fieldKeys = {
  column: 'System.BoardColumn',
  columnDone: 'System.BoardColumnDone',
  lane: 'System.BoardLane',
  rank: 'Microsoft.VSTS.Common.StackRank'
}

module.exports = mapToBoard
