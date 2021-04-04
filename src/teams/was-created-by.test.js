const wasCreatedBy = require('./was-created-by')

describe('wasCreatedBy', () => {
  [
    ['undefined', undefined, new ReferenceError('"members" is not defined')],
    ['object', {}, new TypeError('"members" is not an array of persons')],
    ['not persons', [{}], new TypeError('"members" is not an array of persons')]
  ].forEach(([testName, input, error]) => {
    test(`requires an array of persons (${testName})`, () => {
      const fn = () => wasCreatedBy(input)
      expect(fn).toThrow(error)
    })
  })

  test('returns a function', () => {
    const fn = wasCreatedBy([{ name: 'John Doe', email: 'john.doe@example.com' }])
    expect(fn).toBeInstanceOf(Function)
  })
})

describe('wasCreatedByTeam', () => {
  [
    ['undefined item', undefined, new TypeError("Cannot destructure property 'createdBy' of 'undefined' as it is undefined.")],
    ['undefined createdBy', { createdBy: undefined }, new TypeError('The "createdBy" property of "item" is not defined.')],
    ['createdBy not a person', { createdBy: {} }, new TypeError('The "createdBy" property of "item" is not a person object.')]
  ].forEach(([testName, input, error]) => {
    test(`requires an item with a creator (${testName})`, () => {
      const wasCreatedByTeam = wasCreatedBy([{ name: 'John Doe', email: 'john.doe@example.com' }])
      const fn = () => wasCreatedByTeam(input)
      expect(fn).toThrow(error)
    })
  })

  ;[
    [true, '', { createdBy: { name: 'John Doe', email: 'john.doe@example.com' } }],
    [false, 'not', { createdBy: { name: 'James T. Kirk', email: 'jim@enterprise.starfleet' } }]
  ].forEach(([expected, testName, input]) => {
    test(`returns ${expected} if was ${testName} created by team`, () => {
      const wasCreatedByTeam = wasCreatedBy([{ name: 'John Doe', email: 'john.doe@example.com' }])
      const real = wasCreatedByTeam(input)
      expect(real).toBe(expected)
    })
  })
})
