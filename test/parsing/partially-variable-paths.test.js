var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test('Parsing should find a partial part with fixed left and right', function (t) {
  t.plan(7)

  var results = rhumb._parse('/left{page}right')
    , matchFunction = results.segments[0].matchFunction

  t.deepEqual(results.segments, [
    utils.partialSegment('left{var}right', ['page'], matchFunction)
  ], 'has one partial segment with fixed left and right')

  t.ok(rhumb._parse('/left{page}right').leadingSlash, 'has a leading slash')
  t.notOk(rhumb._parse('/left{page}right').trailingSlash, 'has no trailing slash')

  t.deepEqual(matchFunction('middleright'), null, 'when partial is not match no results are returned')
  t.deepEqual(matchFunction('leftright'), null, 'when empty partial match no results are returned')
  t.deepEqual(matchFunction('leftmiddleright'), { page: 'middle' }, 'match function finds word in middle')
  t.deepEqual(matchFunction('left-middle-right'), { page: '-middle-' }, 'match function finds word in middle')
})

test('Parsing should find a partial part with fixed right', function (t) {
  t.plan(7)

  var results = rhumb._parse('/{page}right')
    , matchFunction = results.segments[0].matchFunction

  t.deepEqual(results.segments, [
    utils.partialSegment('{var}right', ['page'], matchFunction)
  ], 'has one partial segment with fixed right')

  t.ok(rhumb._parse('/{page}right').leadingSlash, 'has a leading slash')
  t.notOk(rhumb._parse('/{page}right').trailingSlash, 'has no trailing slash')

  t.deepEqual(matchFunction('left'), null, 'when partial is not match no results are returned')
  t.deepEqual(matchFunction('right'), null, 'when empty partial match no results are returned')
  t.deepEqual(matchFunction('leftright'), { page: 'left' }, 'match function finds word on the left')
  t.deepEqual(matchFunction('left-middle-right'), { page: 'left-middle-' }, 'match function finds word on the left')
})

test('Parsing should find a partial part with fixed left', function (t) {
  t.plan(7)

  var results = rhumb._parse('/left{page}')
    , matchFunction = results.segments[0].matchFunction

  t.deepEqual(results.segments, [
    utils.partialSegment('left{var}', ['page'], matchFunction)
  ], 'has one partial segment with fixed left')

  t.ok(rhumb._parse('/left{page}').leadingSlash, 'has a leading slash')
  t.notOk(rhumb._parse('/left{page}').trailingSlash, 'has no trailing slash')

  t.deepEqual(matchFunction('right'), null, 'when partial is not match no results are returned')
  t.deepEqual(matchFunction('left'), null, 'when empty partial match no results are returned')
  t.deepEqual(matchFunction('leftright'), { page: 'right' }, 'match function finds word on the right')
  t.deepEqual(matchFunction('left-middle-right'), { page: '-middle-right' }, 'match function finds word on the right')
})

test('Parsing should find a partial part with many variables', function (t) {
  t.plan(6)

  var results = rhumb._parse('/{day}-{month}-{year}')
    , matchFunction = results.segments[0].matchFunction

  t.deepEqual(results.segments, [
    utils.partialSegment('{var}-{var}-{var}', ['day', 'month', 'year'], matchFunction)
  ], 'has one partial segment with three variables')

  t.ok(rhumb._parse('/{day}-{month}-{year}').leadingSlash, 'has a leading slash')
  t.notOk(rhumb._parse('/{day}-{month}-{year}').trailingSlash, 'has no trailing slash')

  t.deepEqual(matchFunction('07.03.2017'), null, 'when partial is not match no results are returned')
  t.deepEqual(matchFunction('-03-2017'), null, 'when empty partial match no results are returned')
  t.deepEqual(matchFunction('07-03-2017'), { day: '07', month: '03', year: '2017' }, 'match function find values of all variables')
})
