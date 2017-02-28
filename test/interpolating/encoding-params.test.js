var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle encoding of the name for a non-empty variable part', function (t) {
  t.plan(3)

  t.equal(rhumb.interpolate('/wibble/{date%2Dof%2Dbirth}', { 'date-of-birth': 'bar' }), '/wibble/bar'
    , 'returns path where variable substituted value when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{ns%2Fname}', { 'ns/name': 'bar' }), '/wibble/bar'
    , 'returns path where variable substituted value when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{ns%252Fname}', { 'ns%2Fname': 'bar' }), '/wibble/bar'
    , 'returns path where variable substituted value when being interpolated')
})

test('Interpolating should handle a non-empty variable part with a value needing encoding', function (t) {
  t.plan(3)

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: '@scope/package' }), '/wibble/%40scope%2Fpackage'
    , 'returns path where variable substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: 'http://www.bing.com/search?q=query' }), '/wibble/http%3A%2F%2Fwww%2Ebing%2Ecom%2Fsearch%3Fq%3Dquery'
    , 'returns path where variable substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: 'specialchars(*-_~!\')' }), '/wibble/specialchars%28%2A%2D%5F%7E%21%27%29'
    , 'returns path where variable substituted with encoded value when being interpolated')
})

test('Interpolating should handle a non-empty partial part with a value needing encoding', function (t) {
  t.plan(3)

  t.equal(rhumb.interpolate('/wibble/foo-{bar}', { bar: 'Hello bar' }), '/wibble/foo-Hello%20bar'
    , 'returns path where partial variables substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble/foo-{bar}', { bar: 'Hello%20bar' }), '/wibble/foo-Hello%2520bar'
    , 'returns path where variable substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/{day}-{month}-{year}', { day: '??', month: 'jan & may', year: '2020' }), '/%3F%3F-jan%20%26%20may-2020'
    , 'returns path where variable substituted with encoded value when being interpolated')
})

test('Interpolating should handle a non-empty variable part inside an optional path with a value needing encoding', function (t) {
  t.plan(3)

  t.equal(rhumb.interpolate('/wibble(/{foo})', { foo: '@scope/package' }), '/wibble/%40scope%2Fpackage'
    , 'returns path where variable substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/{foo})', { foo: 'http://www.bing.com/search?q=query' }), '/wibble/http%3A%2F%2Fwww%2Ebing%2Ecom%2Fsearch%3Fq%3Dquery'
    , 'returns path where variable substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/{foo})', { foo: 'specialchars(*-_~!\')' }), '/wibble/specialchars%28%2A%2D%5F%7E%21%27%29'
    , 'returns path where variable substituted with encoded value when being interpolated')
})

test('Interpolating should handle a non-empty partial part inside an optional path with a value needing encoding', function (t) {
  t.plan(3)

  t.equal(rhumb.interpolate('/wibble(/foo-{bar})', { bar: 'Hello bar' }), '/wibble/foo-Hello%20bar'
    , 'returns path where partial variables substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/foo-{bar})', { bar: 'Hello%20bar' }), '/wibble/foo-Hello%2520bar'
    , 'returns path where variable substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble(/{day}-{month}-{year})', { day: '??', month: 'jan & may', year: '2020' }), '/wibble/%3F%3F-jan%20%26%20may-2020'
    , 'returns path where variable substituted with encoded value when being interpolated')
})
