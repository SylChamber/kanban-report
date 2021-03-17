import { assert } from 'chai'
import mapToBoard from './map-to-board.js'

suite('work items', function () {
  suite('mapToBoard', function () {
    test('copies column', function () {
      const item = {
        fields: {
          'System.BoardColumn': 'Doing'
        }
      }
      const board = mapToBoard(item)
      assert.strictEqual(board.column, item.fields['System.BoardColumn'])
    })

    test('copies column done', function () {
      const item = createBoardWithColumnDone()
      const board = mapToBoard(item)
      assert.strictEqual(board.columnDone, item.fields['System.BoardColumnDone'])
    })

    test('ignores column done if undefined', function () {
      const item = createBasicBoard()
      const board = mapToBoard(item)
      assert.isUndefined(board.columnDone)
      assert.isFalse(Object.keys(board).includes('columnDone'))
    })

    test('copies lane', function () {
      const item = createBasicBoard()
      Object.assign(item.fields, {
        [fieldKeys.lane]: 'Urgent'
      })
      const board = mapToBoard(item)
      assert.strictEqual(board.lane, item.fields[fieldKeys.lane])
    })

    test('ignores lane if undefined', function () {
      const item = createBasicBoard()
      const board = mapToBoard(item)
      assert.isUndefined(board.lane)
      assert.isFalse(Object.keys(board).includes('lane'))
    })

    test('copies rank', function () {
      const item = createBasicBoard()
      Object.assign(item.fields, {
        [fieldKeys.rank]: 588946
      })
      const board = mapToBoard(item)
      assert.strictEqual(board.rank, item.fields[fieldKeys.rank])
    })

    test('ignore rank if undefined', function () {
      const item = createBasicBoard()
      const board = mapToBoard(item)
      assert.isUndefined(board.rank)
      assert.isFalse(Object.keys(board).includes('rank'))
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
})
