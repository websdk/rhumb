var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test('Parsing should handle an optional part covering the whole path', function (t) {
  t.plan(3)

  t.deepEqual(rhumb._parse('(/foo)').segments, [
    utils.optionalPart([utils.fixedSegment('foo')], true)
  ], 'one optional part with one fixed segment found')

  t.notOk(rhumb._parse('(/foo)').leadingSlash, 'has no leading slash')
  t.notOk(rhumb._parse('(/foo)').trailingSlash, 'has no trailing slash')
})

test('Parsing should find optional part at end of path', function (t) {
  t.plan(6)

  t.deepEqual(rhumb._parse('/wibble(/foo)').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([utils.fixedSegment('foo')], true)
  ], 'has a fixed segment followed by an optional part that has one fixed segment')

  t.deepEqual(rhumb._parse('/wibble(/foo/bar)').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([utils.fixedSegment('foo'), utils.fixedSegment('bar')], true)
], 'has a fixed segment followed by an optional part that has two fixed segments')

  t.ok(rhumb._parse('/wibble(/foo)').leadingSlash, 'has a leading slash')
  t.notOk(rhumb._parse('/wibble(/foo)').trailingSlash, 'has no trailing slash')

  t.ok(rhumb._parse('/wibble(/foo/bar)').leadingSlash, 'has a leading slash')
  t.notOk(rhumb._parse('/wibble(/foo/bar)').trailingSlash, 'has no trailing slash')
})

test('Parsing should find nested optional elements at end of path', function (t){
  t.plan(1)

  t.deepEqual(rhumb._parse('/wibble(/foo(/bar))').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([
      utils.fixedSegment('foo')
    , utils.optionalPart([utils.fixedSegment('bar')], true)
    ], true)
  ], 'has a fixed segment followed by an nested optional parts')
})

/*
TODO: later :)
test('should find optional elements anywhere in path', function (t){
  t.plan(1)

  t.deepEqual(rhumb._parse('/wibble/foo(/bar)/bing').segments, [
    utils.fixedSegment('wibble')
  , utils.fixedSegment('foo')
  , utils.optionalPart([utils.fixedSegment('bar')], true)
  , utils.fixedSegment('bing')
  ])
})
*/

test('Parsing should handle a path with fixed part and variable optional part', function (t) {
  t.plan(2)

  t.deepEqual(rhumb._parse('/wibble(/{foo})').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([utils.varSegment('foo')], true)
  ], 'has a fixed segment followed by an optional part that has one variable segment')

  t.deepEqual(rhumb._parse('/wibble(/{foo}/{bar})').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([utils.varSegment('foo'), utils.varSegment('bar')], true)
  ], 'has a fixed segment followed by an optional part that has two variable segments')
})

test('Parsing should handle a path with fixed part and single partial optional part', function (t) {
  t.plan(2)

  var results = [
        rhumb._parse('/wibble(/{foo}-{bar})')
      , rhumb._parse('/wibble(/{foo}-part/part-{bar})')
      ]
    , matchFunctions = results.map(function (result) {
        return result.segments[1].segments.map(function (segment) {
          return segment.matchFunction
        })
      })

  t.deepEqual(results[0].segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([
      utils.partialSegment('{var}-{var}', ['foo', 'bar'], matchFunctions[0][0])
    ], true)
  ], 'has a fixed segment followed by an optional part that has one variable segment')

  t.deepEqual(results[1].segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([
      utils.partialSegment('{var}-part', ['foo'], matchFunctions[1][0])
    , utils.partialSegment('part-{var}', ['bar'], matchFunctions[1][1])
    ], true)
  ], 'has a fixed segment followed by an optional part that has two variable segments')
})

test('Parsing should handle a path with trailing slash in fixed path and leading slash in the optional path', function (t) {
  t.plan(1)

  t.deepEqual(rhumb._parse('/wibble/(/foo)').segments, [
      utils.fixedSegment('wibble')
    , utils.optionalPart([utils.fixedSegment('foo')], true)
    ], 'returns a root part, a fixed part and one optional part when being parsed')
})

test('Optional paths should handle a path with empty parts', function (t) {
  t.plan(3)

  t.deepEqual(rhumb._parse('/wibble(//bar/bing)').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([
      utils.emptySegment()
    , utils.fixedSegment('bar')
    , utils.fixedSegment('bing')
    ], true)
  ], 'ignores empty part at the start of the path when being parsed')

  t.deepEqual(rhumb._parse('/wibble(/foo//bing)').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([
      utils.fixedSegment('foo')
    , utils.emptySegment()
    , utils.fixedSegment('bing')
    ], true)
  ], 'ignores empty part in the middle of the path when being parsed')

  t.deepEqual(rhumb._parse('/wibble(/foo/bar//)').segments, [
    utils.fixedSegment('wibble')
  , utils.optionalPart([
      utils.fixedSegment('foo')
    , utils.fixedSegment('bar')
    , utils.emptySegment()
    ], true, true)
  ], 'ignores empty part at the end of the path when being parsed')
})

test('Parsing should handle a path with empty optional part', function (t) {
  t.plan(1)

  t.deepEqual(rhumb._parse('/wibble()').segments, [
    utils.fixedSegment('wibble()')
  ], 'ignores empty optional path when being parsed')
})

test('Parsing should identify whether a path has a trailing slash based upon the optional elements at end of path', function (t) {
  t.plan(24)
  var hasTrailingSlash = function (path) {
        var result = rhumb._parse(path)
          , lastOptionalPath = result.segments.slice(-1)[0]

        t.ok(lastOptionalPath.trailingSlash, 'last optional path has a trailing slash')
        t.ok(result.trailingSlash, 'top level path inherits the trailing slash')
      }
    , hasNoTrailingSlash = function (path) {
        var result = rhumb._parse(path)
          , lastOptionalPath = result.segments.slice(-1)[0]

        t.notOk(lastOptionalPath.trailingSlash, 'last optional path has no trailing slash')
        t.notOk(result.trailingSlash, 'top level path inherits no trailing slash')
      }

  hasNoTrailingSlash('/foo(/bar)')
  hasNoTrailingSlash('/foo(/bar/bing)')
  hasNoTrailingSlash('foo(/bar)')
  hasNoTrailingSlash('foo(/bar/bing)')

  hasTrailingSlash('/foo(/bar/)')
  hasTrailingSlash('/foo(/bar/bing/)')
  hasTrailingSlash('foo(/bar/)')
  hasTrailingSlash('foo(/bar/bing/)')

  hasTrailingSlash('/foo(//)')
  hasNoTrailingSlash('/foo(//bar/bing)')
  hasNoTrailingSlash('foo(/bar//bing)')
  hasTrailingSlash('foo(/bar//)')
})

test('Parsing should identify whether a path has a trailing slash based upon the nested optional elements at end of path', function (t) {
  t.plan(36)
  var hasTrailingSlash = function (path) {
        var result = rhumb._parse(path)
          , lastOptionalPath = result.segments.slice(-1)[0]
          , lastNestedOptionalPath = lastOptionalPath.segments.slice(-1)[0]

        t.ok(lastNestedOptionalPath.trailingSlash, 'last nested optional path has a trailing slash')
        t.ok(lastOptionalPath.trailingSlash, 'last optional path inherits the trailing slash')
        t.ok(result.trailingSlash, 'top level path inherits the trailing slash')
      }
    , hasNoTrailingSlash = function (path) {
        var result = rhumb._parse(path)
          , lastOptionalPath = result.segments.slice(-1)[0]
          , lastNestedOptionalPath = lastOptionalPath.segments.slice(-1)[0]

        t.notOk(lastNestedOptionalPath.trailingSlash, 'last nested optional path has no trailing slash')
        t.notOk(lastOptionalPath.trailingSlash, 'last optional path has no trailing slash')
        t.notOk(result.trailingSlash, 'top level path has no trailing slash')
      }

  hasNoTrailingSlash('/foo(/bar(/bing))')
  hasNoTrailingSlash('/foo(/bar(/bing/zap))')
  hasNoTrailingSlash('foo(/bar(/bing))')
  hasNoTrailingSlash('foo(/bar(/bing/zap))')

  hasTrailingSlash('/foo(/bar(/bing/))')
  hasTrailingSlash('/foo(/bar(/bing/zap/))')
  hasTrailingSlash('foo(/bar(/bing/))')
  hasTrailingSlash('foo(/bar(/bing/zap/))')

  hasTrailingSlash('/foo(/bar(//))')
  hasNoTrailingSlash('/foo(/bar(//bing))')
  hasNoTrailingSlash('foo(/bar(/bing//zap))')
  hasTrailingSlash('foo(/bar(/bing//))')
})
