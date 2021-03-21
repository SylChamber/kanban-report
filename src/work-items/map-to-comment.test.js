const mapToComment = require('./map-to-comment')

describe('mapToComment', function () {
  test('copies id', function () {
    const workItemComment = createBasicWorkItemComment()
    const realComment = mapToComment(workItemComment)
    expect(realComment.id).toEqual(workItemComment.id)
  })

  test('copies work item id', function () {
    const workItemComment = createBasicWorkItemComment()
    const realComment = mapToComment(workItemComment)
    expect(realComment.workItemId).toEqual(workItemComment.workItemId)
  })

  test('copies text', function () {
    const workItemComment = createBasicWorkItemComment()
    const realComment = mapToComment(workItemComment)
    expect(realComment.text).toEqual(workItemComment.text)
  })

  test('copies created date', function () {
    const createdDate = '2021-02-21T21:21:21Z'
    const expectedDate = new Date(createdDate)
    const workItemComment = Object.assign(
      createBasicWorkItemComment(),
      {
        createdDate: createdDate
      })
    const realComment = mapToComment(workItemComment)
    expect(realComment.createdDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('copies created by', function () {
    const expectedCreatedBy = {
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
    const workItemComment = Object.assign(
      createBasicWorkItemComment(),
      {
        createdBy: {
          displayName: expectedCreatedBy.name,
          uniqueName: expectedCreatedBy.email
        }
      })
    const realComment = mapToComment(workItemComment)
    expect(realComment.createdBy).toEqual(expectedCreatedBy)
  })

  test('copies modified date', function () {
    const modifiedDate = '2021-02-22T22:22:22Z'
    const expectedDate = new Date(modifiedDate)
    const workItemComment = Object.assign(
      createBasicWorkItemComment(),
      {
        modifiedDate: modifiedDate
      })
    const realComment = mapToComment(workItemComment)
    expect(realComment.modifiedDate.valueOf()).toEqual(expectedDate.valueOf())
  })

  test('copies modified by', function () {
    const expectedModifiedBy = {
      name: 'John Doe',
      email: 'john.doe@example.com'
    }
    const workItemComment = Object.assign(
      createBasicWorkItemComment(),
      {
        modifiedBy: {
          displayName: expectedModifiedBy.name,
          uniqueName: expectedModifiedBy.email
        }
      }
    )
    const realComment = mapToComment(workItemComment)
    expect(realComment.modifiedBy).toEqual(expectedModifiedBy)
  })

  test('ignores modified date if absent', function () {
    const workItemComment = createBasicWorkItemComment()
    const realComment = mapToComment(workItemComment)
    expect(realComment).not.toHaveProperty('modifiedDate')
  })

  test('ignores modified by if absent', function () {
    const workItemComment = createBasicWorkItemComment()
    const realComment = mapToComment(workItemComment)
    expect(realComment).not.toHaveProperty('modifiedBy')
  })

  test('copies url', function () {
    const workItemComment = createBasicWorkItemComment()
    const realComment = mapToComment(workItemComment)
    expect(realComment.url).toEqual(workItemComment.url)
  })

  test('copies version number', function () {
    const workItemComment = createBasicWorkItemComment()
    const realComment = mapToComment(workItemComment)
    expect(realComment.version).toEqual(workItemComment.version)
  })

  function createBasicWorkItemComment () {
    return {
      id: 5,
      workItemId: 512,
      version: 2,
      text: '<div>some text</div>',
      url: 'https://dev.azure.com/org/project/_apis/wit/workItems/512/comments/5'
    }
  }
})
