const mapToPerson = require('./map-to-person')

describe('mapToPerson', function () {
  test('copies email', function () {
    const identity = createIdentity()
    const person = mapToPerson(identity)
    expect(person.email).toEqual(identity.uniqueName)
  })

  test('copies name', function () {
    const identity = createIdentity()
    const person = mapToPerson(identity)
    expect(person.name).toEqual(identity.displayName)
  })

  test('ignores email if absent', function () {
    const identity = { displayName: 'John Doe' }
    const person = mapToPerson(identity)
    expect(person.email).toBeUndefined()
  })

  test('ignores name if absent', function () {
    const identity = { uniqueName: 'john.doe@example.com' }
    const person = mapToPerson(identity)
    expect(person.name).toBeUndefined()
  })

  test('returns undefined if identity undefined', function () {
    const person = mapToPerson(undefined)
    expect(person).toBeUndefined()
  })

  function createIdentity () {
    return {
      displayName: 'John Doe',
      uniqueName: 'john.doe@example.com'
    }
  }
})
