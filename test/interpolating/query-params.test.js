var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle query params on fixed paths', function (t) {
  t.plan(5)

  t.equal(rhumb.interpolate('/?q=value', {}), '/?q=value'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/foo?q=value', {}), '/foo?q=value'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/foo/bar/bing?q=value', {}), '/foo/bar/bing?q=value'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/wibble?foo=bar&bing=value', {}), '/wibble?foo=bar&bing=value'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/wibble/wobble?foo=bar&bing=value', {}), '/wibble/wobble?foo=bar&bing=value'
    , 'returns path without modification when being interpolated')
})

test('Interpolating should handle query params on optional paths', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/wibble(/foo)?q=value', {}), '/wibble/foo?q=value'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/foo/bar)?q=value', {}), '/wibble/foo/bar?q=value'
    , 'returns path without modification when being interpolated')
})

test('Interpolating should handle a nested optional path with parts', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/wibble(/foo(/bing))?q=value', {}), '/wibble/foo/bing?q=value'
    , 'returns path without modification when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/foo/bar(/bing))?q=value', {}), '/wibble/foo/bar/bing?q=value'
    , 'returns path without modification when being interpolated')
})

test('Interpolating should handle incomplete query params', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble?foo=bar&bing&', {}), '/wibble?foo=bar&bing&'
    , 'returns path without modification when being interpolated')
})

test('Interpolating should handle empty query params', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble?foo=&bar&bing=value', {}), '/wibble?foo=&bar&bing=value'
    , 'returns path without modification when being interpolated')
})
