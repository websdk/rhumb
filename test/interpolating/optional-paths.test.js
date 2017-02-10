var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle a path with an empty fixed part', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('(/foo)', {}), '/foo'
    , 'includes optional path when being interpolated')
})

test('Interpolating should handle a path with fixed part and optional part', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/wibble(/foo)', {}), '/wibble/foo'
    , 'includes optional path when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/foo/bar)', {}), '/wibble/foo/bar'
    , 'includes optional path when being interpolated')
})

test('Interpolating should handle a path with fixed part and optional parts containing a trailing slash', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/wibble(/foo/)', {}), '/wibble/foo'
    , 'handles optional path with a single fixed part and trailing slash when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/foo/bar/)', {}), '/wibble/foo/bar'
    , 'handles optional path with multiple fixed parts and trailing slash when being interpolated')
})

test('Interpolating should handle a path with empty optional part', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble()', {}), '/wibble'
    , 'ignores empty optional path when being interpolated')
})

test('Interpolating should handle a path with trailing slash in fixed path and leading slash in the optional path', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble/(/foo)', {}), '/wibble/foo'
    , 'prevents duplicate slashes when being interpolated')
})

test('Interpolating should handle a path with empty parts', function (t) {
  t.plan(3)

  t.equal(rhumb.interpolate('/wibble(//bar/bing)', {}), '/wibble/bar/bing'
    , 'handles empty part at the start of the optional path when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/foo//bing)', {}), '/wibble/foo/bing'
    , 'handles empty part in the middle of the optional path when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/foo/bar//)', {}), '/wibble/foo/bar'
    , 'handles empty part at the end of the optional path when being interpolated')
})

test('Interpolating should handle a path with fixed part and single variable optional part', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble(/{foo})', { foo: 'bing' }), '/wibble/bing'
    , 'includes optional path when being interpolated')
})

test('Interpolating should handle a path with fixed part and multiple variable optional parts', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble(/{foo}/{bar})', { foo: 'bing', bar: 'wobble' }), '/wibble/bing/wobble'
    , 'includes optional path when being interpolated')
})

test('Interpolating should handle a path with fixed part and single partial optional part', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble(/{foo}-{bar})', { foo: 'bing', bar: 'wobble' }), '/wibble/bing-wobble'
    , 'includes optional path when being interpolated')
})

test('Interpolating should handle a path with fixed part and multiple partial optional parts', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble(/{foo}-part/part-{bar})', { foo: 'bing', bar: 'wobble' }), '/wibble/bing-part/part-wobble'
    , 'includes optional path when being interpolated')
})
