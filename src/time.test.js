const getPreviousWorkday = require('./time')

describe('time', function () {
  describe('getPreviousWorkDay', function () {
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

    test.each([
      ['from Tuesday to Friday', new Date('2021-03-09T09:09:09Z'), new Date('2021-03-08T09:09:09Z')],
      // daylight savings time during the weekend
      ['for Monday', new Date('2021-03-15T15:15:15Z'), new Date('2021-03-12T16:15:15Z')],
      ['for Sunday', new Date('2021-03-07T07:07:07Z'), new Date('2021-03-05T07:07:07Z')],
      // wrong day if timezone set with UTC (Z) because date manipulation is done with local time
      ['for January 1st', new Date('2023-01-01T01:01:01-0500'), new Date('2022-12-30T01:01:01-0500')]
    ])('returns previous workday %s', (name, data, expected) => {
      const real = getPreviousWorkday(data)
      expect(real).toEqual(expected)
    })
    dateSamples.forEach(function (date) {
      test(`returns previous work day ${date.name}`, function () {
        const real = getPreviousWorkday(date.data)
        expect(real).toEqual(date.expected)
      })
    })
  })
})
