import mapToPerson from './map-to-person.mjs'
import { assert } from 'chai'

suite('mapToPerson', function () {
  test('copies name', function () {
    const identity = createIdentity()
    const person = mapToPerson(identity)
    assert.strictEqual(person.name, identity.displayName)
  })

  test('copies email', function () {
    const identity = createIdentity()
    const person = mapToPerson(identity)
    assert.strictEqual(person.email, identity.uniqueName)
  })

  function createIdentity () {
    return {
      displayName: 'John Doe',
      uniqueName: 'john.doe@example.com'
    }
  }
})
