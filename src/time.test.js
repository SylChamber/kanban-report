const { getPreviousWorkday, getDifferenceInBusinessDays } = require('./time')

describe('getPreviousWorkDay', function () {
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
})

describe('getDifferenceInBusinessDays', () => {
  test.each([
    ['same week', new Date('2021-04-02T04:00:00Z'), new Date('2021-03-29T04:00:00Z'), 4],
    ['previous week', new Date('2021-03-29T04:00:00Z'), new Date('2021-03-25T04:00:00Z'), 2]
  ])('returns difference in business days (%)', function returnsDifference (testName, later, earlier, expected) {
    const real = getDifferenceInBusinessDays(later, earlier)
    expect(real).toEqual(expected)
  })
})
