const createGetCurrentUserStoriesGetter = require('./get-current-user-stories')

describe('createGetCurrentUserStoriesGetter', () => {
  test.each([
    ['getCurrentUserStoryIds (undefined)', [undefined, jest.fn()], new ReferenceError('"getCurrentUserStoryIds" is not defined.')],
    ['getCurrentUserStoryIds (not a function)', [{}, jest.fn()], new TypeError('"getCurrentUserStoryIds" is not a function.')],
    ['getCompleteUserStories (undefined)', [jest.fn(), undefined], new ReferenceError('"getCompleteUserStories" is not defined.')],
    ['getCompleteUserStories (not a function)', [jest.fn(), {}], new TypeError('"getCompleteUserStories" is not a function.')]
  ])('requires %s', (testName, [getCurrentUserStoryIds, getCompleteUserStories], error) => {
    const fn = () => createGetCurrentUserStoriesGetter(getCurrentUserStoryIds, getCompleteUserStories)
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
      const idsData = { referenceDate: referenceDate, stories: [] }
      const getCurrentUserStoryIds = jest.fn().mockName('getCurrentUserStoryIds').mockResolvedValue(idsData)
      const getStories = createGetCurrentUserStoriesGetter(getCurrentUserStoryIds, jest.fn())
      const result = await getStories(team, referenceDate)
      expect(result).toHaveProperty('referenceDate')
      expect(result.referenceDate).toEqual(referenceDate)
    })

    test('user stories', async () => {
      const team = 'Area51'
      const referenceDate = new Date('2020-02-20T20:20:20Z')
      const idsData = {
        referenceDate: referenceDate.toISOString(),
        stories: [{ id: 5, url: 'https://devops/org/proj/_apis/wit/workitems/5' }]
      }
      const storiesData = [{
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
      const getCurrentUserStoryIds = jest.fn().mockName('getCurrentUserStories').mockResolvedValue(idsData)
      const getCompleteUserStories = jest.fn().mockName('getCompleteUserStories').mockResolvedValue(storiesData)
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
      const getStories = createGetCurrentUserStoriesGetter(getCurrentUserStoryIds, getCompleteUserStories)
      const result = await getStories(team, referenceDate)
      expect(result).toHaveProperty('stories')
      expect(result.stories).toBeInstanceOf(Array)
      expect(result.stories).toHaveLength(expected.stories.length)
      expect(result.stories).toEqual(expect.objectContaining(expected.stories))
    })
  })
})
