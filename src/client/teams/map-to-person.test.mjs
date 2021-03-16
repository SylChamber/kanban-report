import mapToPerson from './map-to-person.mjs'
import { assert } from 'chai'

suite('mapToPerson', function () {
  test('copies name', function () {
    const identity = createIdentity()
    const person = mapToPerson(identity)
    assert.strictEqual(person.name, identity.displayName)
  })

  test('ignores name if absent', function () {
    const identity = { uniqueName: 'john.doe@example.com' }
    const person = mapToPerson(identity)
    assert.isUndefined(person.name)
  })

  test('copies email', function () {
    const identity = createIdentity()
    const person = mapToPerson(identity)
    assert.strictEqual(person.email, identity.uniqueName)
  })

  test('ignores email if absent', function () {
    const identity = { displayName: 'John Doe' }
    const person = mapToPerson(identity)
    assert.isUndefined(person.email)
  })

  test('returns undefined if identity undefined', function () {
    const person = mapToPerson(undefined)
    assert.isUndefined(person)
  })

  function createIdentity () {
    return {
      displayName: 'John Doe',
      uniqueName: 'john.doe@example.com'
    }
  }
})
