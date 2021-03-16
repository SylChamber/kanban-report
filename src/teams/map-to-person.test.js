import mapToPerson from './map-to-person.js'
import { assert } from 'chai'

suite('teams', function () {
  suite('mapToPerson', function () {
    test('copies email', function () {
      const identity = createIdentity()
      const person = mapToPerson(identity)
      assert.strictEqual(person.email, identity.uniqueName)
    })

    test('copies name', function () {
      const identity = createIdentity()
      const person = mapToPerson(identity)
      assert.strictEqual(person.name, identity.displayName)
    })

    test('ignores email if absent', function () {
      const identity = { displayName: 'John Doe' }
      const person = mapToPerson(identity)
      assert.isUndefined(person.email)
    })

    test('ignores name if absent', function () {
      const identity = { uniqueName: 'john.doe@example.com' }
      const person = mapToPerson(identity)
      assert.isUndefined(person.name)
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
})