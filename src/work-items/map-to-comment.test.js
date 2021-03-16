import { assert } from 'chai'
import mapToComment from './map-to-comment.js'

suite('work items', function () {
  suite('mapToComment', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe

    test('copies id', function () {
      const workItemComment = createBasicWorkItemComment()
      const comment = mapToComment(workItemComment)
      assert.strictEqual(comment.id, workItemComment.id)
    })

    test('copies work item id', function () {
      const workItemComment = createBasicWorkItemComment()
      const comment = mapToComment(workItemComment)
      assert.strictEqual(comment.workItemId, workItemComment.workItemId)
    })

    function createBasicWorkItemComment () {
      return {
        id: 5,
        workItemId: 512
      }
    }
  })
})
