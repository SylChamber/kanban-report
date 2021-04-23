const createGetCurrentUserStoriesGetter = require('./get-current-user-stories')

describe('createGetCurrentUserStoriesGetter', () => {
  test.each([
    ['getCurrentWorkItemIds (undefined)', [undefined, jest.fn()], new ReferenceError('"getCurrentWorkItemIds" is not defined.')],
    ['getCurrentWorkItemIds (not a function)', [{}, jest.fn()], new TypeError('"getCurrentWorkItemIds" is not a function.')],
    ['getCompleteWorkItems (undefined)', [jest.fn(), undefined], new ReferenceError('"getCompleteWorkItems" is not defined.')],
    ['getCompleteWorkItems (not a function)', [jest.fn(), {}], new TypeError('"getCompleteWorkItems" is not a function.')]
  ])('requires %s', (testName, [getCurrentWorkItemIds, getCompleteWorkItems], error) => {
    const fn = () => createGetCurrentUserStoriesGetter(getCurrentWorkItemIds, getCompleteWorkItems)
    expect(fn).toThrow(error)
  })

  test('returns a function', () => {
    const fn = createGetCurrentUserStoriesGetter(jest.fn(), jest.fn())
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('getCurrentUserStories', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  test.each([
    ['team (undefined)', undefined, new ReferenceError('"team" is not defined.')],
    ['team (empty)', '', new TypeError('"team" is empty.')]
  ])('requires %s', async function requires (testName, input, error) {
    const getCurrentUserStories = createGetCurrentUserStoriesGetter(jest.fn(), jest.fn())
    const fn = async () => await getCurrentUserStories(input, undefined)
    return expect(fn).rejects.toThrow(error)
  })

  describe('returns', () => {
    test('reference date', async () => {
      const team = 'Area51'
      const referenceDate = new Date('2020-02-20T20:20:20Z')
      const idsData = { referenceDate: referenceDate, items: [] }
      const getCurrentWorkItemIds = jest.fn().mockName('getCurrentWorkItemIds').mockResolvedValue(idsData)
      const getStories = createGetCurrentUserStoriesGetter(getCurrentWorkItemIds, jest.fn())
      const result = await getStories(team, referenceDate)
      expect(result).toHaveProperty('referenceDate')
      expect(result.referenceDate).toEqual(referenceDate)
    })

    test('user stories', async () => {
      const team = 'Area51'
      const referenceDate = new Date('2020-02-20T20:20:20Z')
      const idsData = {
        referenceDate: referenceDate.toISOString(),
        items: [{ id: 5, url: 'https://devops/org/proj/_apis/wit/workitems/5' }]
      }
      const itemsData = [{
        areaPath: 'TheWay',
        board: { column: 'Todo', columnDone: false },
        comments: [{
          id: 500,
          workItemId: 5,
          version: 1,
          text: 'not cool, dude!',
          createdBy: {
            name: 'John Doe',
            email: 'john.doe@example.com'
          },
          createdDate: new Date('2021-02-21T21:21:21Z'),
          url: 'https://devops/workitems/5/comments/500'
        }],
        createdBy: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        createdDate: new Date('2020-02-20T20:20:20Z'),
        description: 'to do',
        id: 5,
        project: 'Proj',
        revision: 10,
        state: 'New',
        stateChangeDate: new Date('2020-02-20T20:20:20Z'),
        stateReason: 'New',
        title: 'Stuff to do',
        url: 'https://devops/workitems/5',
        workItemType: 'User Story'
      }]
      const getCurrentWorkItemIds = jest.fn().mockName('getCurrentUserStories').mockResolvedValue(idsData)
      const getCompleteWorkItems = jest.fn().mockName('getCompleteWorkItems').mockResolvedValue(itemsData)
      const expected = {
        referenceDate: referenceDate,
        stories: [{
          areaPath: 'TheWay',
          board: { column: 'Todo', columnDone: false },
          comments: [{
            id: 500,
            workItemId: 5,
            version: 1,
            text: 'not cool, dude!',
            createdBy: {
              name: 'John Doe',
              email: 'john.doe@example.com'
            },
            createdDate: new Date('2021-02-21T21:21:21Z'),
            url: 'https://devops/workitems/5/comments/500'
          }],
          createdBy: {
            name: 'John Doe',
            email: 'john.doe@example.com'
          },
          createdDate: new Date('2020-02-20T20:20:20Z'),
          description: 'to do',
          id: 5,
          project: 'Proj',
          revision: 10,
          state: 'New',
          stateChangeDate: new Date('2020-02-20T20:20:20Z'),
          stateReason: 'New',
          title: 'Stuff to do',
          url: 'https://devops/workitems/5',
          workItemType: 'User Story'
        }]
      }
      const getStories = createGetCurrentUserStoriesGetter(getCurrentWorkItemIds, getCompleteWorkItems)
      const result = await getStories(team, referenceDate)
      expect(result).toHaveProperty('stories')
      expect(result.stories).toBeInstanceOf(Array)
      expect(result.stories).toHaveLength(expected.stories.length)
      expect(result.stories).toEqual(expect.objectContaining(expected.stories))
    })
  })
})
