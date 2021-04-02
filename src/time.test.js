const {
  getPreviousWorkday,
  getDifferenceInBusinessDays,
  wasCreatedOrModifiedOnOrSince
} = require('./time')

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
  ])('returns difference in business days (%s)', function returnsDifference (testName, later, earlier, expected) {
    const real = getDifferenceInBusinessDays(later, earlier)
    expect(real).toEqual(expected)
  })
})

describe('wasCreatedOrModifiedOnOrSince', () => {
  [
    [true, 'created on same day', '2021-03-30T00:00-0400', '2021-03-30T08:00-0400', undefined],
    [false, 'created previous workday', '2021-03-30T00:00-0400', '2021-03-29T12:00-0400', undefined],
    [true, 'created next workday', '2021-03-30T00:00-0400', '2021-03-31T07:00-0400', undefined],
    [true, 'created next workday (weekend)', '2021-03-26T00:00-0400', '2021-03-29T08:00-0400', undefined],
    [true, 'modified on same day', '2021-03-30T00:00-0400', '2021-03-29T00:00-0400', '2021-03-30T08:00-0400'],
    [false, 'modified previous workday', '2021-03-30T00:00-0400', '2021-03-28T12:00-0400', '2021-03-29T12:00-0400'],
    [true, 'modified next workday', '2021-03-30T00:00-0400', '2021-03-29T08:00-0400', '2021-03-31T07:00-0400'],
    [true, 'modified next workday (weekend)', '2021-03-26T00:00-0400', '2021-03-25T08:00-0400', '2021-03-27T07:00-0400']
  ].forEach(([expected, testName, reference, created, modified]) => {
    test(`returns ${expected} if comment was ${testName}`, () => {
      const wasCreatedOrModified = wasCreatedOrModifiedOnOrSince(new Date(reference))
      const comment = {
        createdDate: new Date(created),
        modifiedDate: new Date(modified)
      }
      expect(wasCreatedOrModified(comment)).toBe(expected)
    })
  })
})
