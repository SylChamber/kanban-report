const mapToBoard = require('./map-to-board')

describe('mapToBoard', function () {
  test('copies column', function () {
    const item = {
      fields: {
        'System.BoardColumn': 'Doing'
      }
    }
    const board = mapToBoard(item)
    expect(board.column).toEqual(item.fields['System.BoardColumn'])
  })

  test('copies column done', function () {
    const item = createBoardWithColumnDone()
    const board = mapToBoard(item)
    expect(board.columnDone).toEqual(item.fields['System.BoardColumnDone'])
  })

  test('copies lane', function () {
    const item = createBasicBoard()
    Object.assign(item.fields, {
      [fieldKeys.lane]: 'Urgent'
    })
    const board = mapToBoard(item)
    expect(board.lane).toEqual(item.fields[fieldKeys.lane])
  })

  test('copies rank', function () {
    const item = createBasicBoard()
    Object.assign(item.fields, {
      [fieldKeys.rank]: 588946
    })
    const board = mapToBoard(item)
    expect(board.rank).toEqual(item.fields[fieldKeys.rank])
  })

  test('ignores column done if undefined', function () {
    const item = createBasicBoard()
    const board = mapToBoard(item)
    expect(board).not.toHaveProperty('columnDone')
  })

  test('ignores lane if undefined', function () {
    const item = createBasicBoard()
    const board = mapToBoard(item)
    expect(board).not.toHaveProperty('lane')
  })

  test('ignore rank if undefined', function () {
    const item = createBasicBoard()
    const board = mapToBoard(item)
    expect(board).not.toHaveProperty('rank')
  })

  function createBasicBoard () {
    return {
      fields: {
        [fieldKeys.column]: 'Doing'
      }
    }
  }

  function createBoardWithColumnDone () {
    const fields = Object.assign({
      [fieldKeys.columnDone]: false
    }, createBasicBoard().fields)

    return {
      fields
    }
  }

  const fieldKeys = {
    column: 'System.BoardColumn',
    columnDone: 'System.BoardColumnDone',
    lane: 'System.BoardLane',
    rank: 'Microsoft.VSTS.Common.StackRank'
  }
})
