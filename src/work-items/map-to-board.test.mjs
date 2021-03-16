import { assert } from 'chai'
import mapToBoard from './map-to-board.mjs'

suite('work items', function () {
  suite('mapToBoard', function () {
    test('exists in module', function () {
      assert.isFunction(mapToBoard)
    })

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
    })

    function createBasicBoard () {
      return {
        fields: {
          'System.BoardColumn': 'Doing'
        }
      }
    }

    function createBoardWithColumnDone () {
      const fields = Object.assign({
        'System.BoardColumnDone': true
      }, createBasicBoard().fields)

      return {
        fields
      }
    }
  })
})
