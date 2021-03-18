import { assert } from 'chai'
import { getPreviousWorkday } from './time.js'

suite('time', function () {
  suite('getPreviousWorkDay', function () {
    const dateSamples = [{
      name: 'from Tuesday to Friday',
      data: new Date('2021-03-09T09:09:09Z'),
      expected: new Date('2021-03-08T09:09:09Z')
    },
    {
      name: 'for Monday',
      data: new Date('2021-03-15T15:15:15Z'),
      expected: new Date('2021-03-12T16:15:15Z') // daylight savings time during the weekend
    },
    {
      name: 'for Sunday',
      data: new Date('2021-03-07T07:07:07Z'),
      expected: new Date('2021-03-05T07:07:07Z')
    },
    {
      name: 'for January 1st',
      data: new Date('2023-01-01T01:01:01-0500'),
      // wrong day if timezone set with UTC (Z) because date manipulation is done with local time
      expected: new Date('2022-12-30T01:01:01-0500')
    }]

    // eslint-disable-next-line mocha/no-setup-in-describe
    dateSamples.forEach(function (date) {
      test(`returns previous work day ${date.name}`, function () {
        const real = getPreviousWorkday(date.data)
        assert.strictEqual(real.toUTCString(), date.expected.toUTCString())
      })
    })
  })
})
