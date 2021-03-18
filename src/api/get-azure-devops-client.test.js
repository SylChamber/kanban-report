import chai, { assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fetch from 'node-fetch'
import getAzureDevopsClient from './get-azure-devops-client.js'

suite('api', function () {
  suite('getAzureDevopsClient', function () {
    test('requires fetch', function () {
      const fn = () => getAzureDevopsClient()
      assert.throws(fn, ReferenceError, '"fetch" is not defined')
    })

    test('returns function to get client', function () {
      const fetchStub = {}
      const client = getAzureDevopsClient(fetchStub)
      assert.isFunction(client)
    })

    suite('returned function', function () {
      test('requires options', function () {
        const fn = () => getAzureDevopsClient(createFetchStub)()
        assert.throws(fn, ReferenceError, '"options" is not defined')
      })

      test('requires organization', function () {
        const options = { project: 'proj' }
        const fn = opt => getAzureDevopsClient(createFetchStub)(options)
        assert.throws(fn, TypeError, 'The "organization" property is not defined')
      })

      test('requires project', function () {
        const options = { organization: 'org' }
        const fn = opt => getAzureDevopsClient(createFetchStub)(options)
        assert.throws(fn, TypeError, 'The "project" property is not defined')
      })

      function createFetchStub () {
        return {}
      }
    })
  })
})
