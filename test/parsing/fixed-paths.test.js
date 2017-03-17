var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test('Parsing handles empty path', function (t) {
  t.plan(3)

  t.deepEqual(rhumb._parse('').segments, [], 'no segments found')
  t.notOk(rhumb._parse('').leadingSlash, 'has no leading slash')
  t.notOk(rhumb._parse('').trailingSlash, 'has no trailing slash')
})

test('Parsing handles the root path', function (t) {
  t.plan(3)

  t.deepEqual(rhumb._parse('/').segments, [], 'no segments found')
  t.ok(rhumb._parse('/').leadingSlash, 'has a leading slash')
  t.ok(rhumb._parse('/').trailingSlash, 'has a trailing slash')
})

test('Parsing should find segments for a path with fixed segments', function (t) {
  t.plan(12)

  t.deepEqual(rhumb._parse('/foo').segments, [utils.fixedSegment('foo')], 'one fixed segment found')
  t.deepEqual(rhumb._parse('/foo/').segments, [utils.fixedSegment('foo')], 'one fixed segment found')
  t.deepEqual(rhumb._parse('foo').segments, [utils.fixedSegment('foo')], 'one fixed segment found')
  t.deepEqual(rhumb._parse('foo/').segments, [utils.fixedSegment('foo')], 'one fixed segment found')

  var fooBarBingSegments = [utils.fixedSegment('foo'), utils.fixedSegment('bar'), utils.fixedSegment('bing')]
  t.deepEqual(rhumb._parse('/foo/bar/bing').segments, fooBarBingSegments, 'three fixed segments found')
  t.deepEqual(rhumb._parse('/foo/bar/bing/').segments, fooBarBingSegments, 'three fixed segments found')
  t.deepEqual(rhumb._parse('foo/bar/bing').segments, fooBarBingSegments, 'three fixed segments found')
  t.deepEqual(rhumb._parse('foo/bar/bing/').segments, fooBarBingSegments, 'three fixed segments found')

  t.deepEqual(rhumb._parse('//').segments
    , [utils.emptySegment()], 'empty segment found')
  t.deepEqual(rhumb._parse('//bar/bing').segments
    , [utils.emptySegment(), utils.fixedSegment('bar'), utils.fixedSegment('bing')], 'two fixed and one empty segment found')
  t.deepEqual(rhumb._parse('foo//').segments
    , [utils.fixedSegment('foo'), utils.emptySegment()], 'one fixed and one empty segment found')
  t.deepEqual(rhumb._parse('foo//bing').segments
    , [utils.fixedSegment('foo'), utils.emptySegment(), utils.fixedSegment('bing')], 'two fixed and one empty segment found')
})

test('Parsing should identify whether a path with fixed segments has a leading slash', function (t) {
  t.plan(12)

  t.ok(rhumb._parse('/foo').leadingSlash, 'has a leading slash')
  t.ok(rhumb._parse('/foo/').leadingSlash, 'has a leading slash')
  t.ok(rhumb._parse('/foo/bar/bing').leadingSlash, 'has a leading slash')
  t.ok(rhumb._parse('/foo/bar/bing/').leadingSlash, 'has a leading slash')

  t.notOk(rhumb._parse('foo').leadingSlash, 'has no leading slash')
  t.notOk(rhumb._parse('foo/').leadingSlash, 'has no leading slash')
  t.notOk(rhumb._parse('foo/bar/bing').leadingSlash, 'has no leading slash')
  t.notOk(rhumb._parse('foo/bar/bing/').leadingSlash, 'has no leading slash')

  t.ok(rhumb._parse('//').leadingSlash, 'has a leading slash')
  t.ok(rhumb._parse('//bar/bing').leadingSlash, 'has a leading slash')
  t.notOk(rhumb._parse('foo//').leadingSlash, 'has no leading slash')
  t.notOk(rhumb._parse('foo//bing').leadingSlash, 'has no leading slash')
})

test('Parsing should identify whether a path with fixed segments has a trailing slash', function (t) {
  t.plan(12)

  t.notOk(rhumb._parse('/foo').trailingSlash, 'has no trailing slash')
  t.notOk(rhumb._parse('/foo/bar/bing').trailingSlash, 'has no trailing slash')
  t.notOk(rhumb._parse('foo').trailingSlash, 'has no trailing slash')
  t.notOk(rhumb._parse('foo/bar/bing').trailingSlash, 'has no trailing slash')

  t.ok(rhumb._parse('/foo/').trailingSlash, 'has a trailing slash')
  t.ok(rhumb._parse('/foo/bar/bing/').trailingSlash, 'has a trailing slash')
  t.ok(rhumb._parse('foo/').trailingSlash, 'has a trailing slash')
  t.ok(rhumb._parse('foo/bar/bing/').trailingSlash, 'has a trailing slash')

  t.ok(rhumb._parse('//').trailingSlash, 'has a trailing slash')
  t.notOk(rhumb._parse('//bar/bing').trailingSlash, 'has no trailing slash')
  t.ok(rhumb._parse('foo//').trailingSlash, 'has a trailing slash')
  t.notOk(rhumb._parse('foo//bing').trailingSlash, 'has no trailing slash')
})
