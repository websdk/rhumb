var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should always infer root', function(t) {
  t.plan(2)

  t.equal(rhumb.interpolate('', {}), '/'
    , 'adds a slash when being interpolated')

  t.equal(rhumb.interpolate('/', {}), '/'
    , 'keeps the slash when being interpolated')
})

test('Interpolating should handle one fixed part', function(t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/foo', {}), '/foo'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/foo/', {}), '/foo'
    , 'returns path without trailing slash when being interpolated')
})

test('Interpolating should handle multiple fixed parts', function(t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/foo/bar/bing', {}), '/foo/bar/bing'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/foo/bar/bing/', {}), '/foo/bar/bing'
    , 'returns path without trailing slash when being interpolated')
})

test('Interpolating should handle a path with no leading slash', function(t) {
  t.plan(4)

  t.equal(rhumb.interpolate('foo', {}), '/foo'
  , 'returns path with leading slash when being interpolated')

  t.equal(rhumb.interpolate('foo/bar/bing', {}), '/foo/bar/bing'
    , 'returns path with leading slash when being interpolated')

  t.equal(rhumb.interpolate('foo/', {}), '/foo'
  , 'returns path without trailing slash and with leading slash when being interpolated')

  t.equal(rhumb.interpolate('foo/bar/bing/', {}), '/foo/bar/bing'
  , 'returns path without trailing slash and with leading slash when being interpolated')
})

test('Interpolating should handle a path with empty parts', function(t) {
  t.plan(4)

  t.equal(rhumb.interpolate('foo', {}), '/foo'
  , 'returns path with leading slash when being interpolated')

  t.equal(rhumb.interpolate('foo/bar/bing', {}), '/foo/bar/bing'
    , 'returns path with leading slash when being interpolated')

  t.equal(rhumb.interpolate('foo/', {}), '/foo'
  , 'returns path without trailing slash and with leading slash when being interpolated')

  t.equal(rhumb.interpolate('foo/bar/bing/', {}), '/foo/bar/bing'
  , 'returns path without trailing slash and with leading slash when being interpolated')
})
