var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle a non-empty param', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/{foo}', { foo: 'bar' }), '/bar'
    , 'returns path where variable substituted when being interpolated')
})

test('Interpolating should handle a non-empty param with after fixed part', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: 'one' }), '/wibble/one'
    , 'returns path where variable substituted when being interpolated')
})


test('Interpolating should handle multiple non-empty params', function (t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/wibble/{foo}/{bar}', { foo: 'two', bar: 'three' }), '/wibble/two/three'
    , 'returns path where variable substituted when being interpolated')
})

test('Interpolating should handle encoding a non-empty param', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: 'http://www.bing.com/' }), '/wibble/http%3A%2F%2Fwww.bing.com%2F'
    , 'returns path where variable substituted with encoded value when being interpolated')


  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: 'Hello%20bar' }), '/wibble/Hello%2520bar'
    , 'returns path where variable substituted with encoded value when being interpolated')
})

test('Interpolating should handle missing, null, undefined and empty param', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/{foo}', {}), '/'
    , 'returns path where missing variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/{foo}', { foo: null }), '/'
    , 'returns path where null variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/{foo}', { foo: undefined }), '/'
    , 'returns path where undefined variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/{foo}', { foo: '' }), '/'
    , 'returns path where empty variable is removed when being interpolated')
})

test('Interpolating should handle missing, null, undefined and empty param after a fixed part', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/{foo}', {}), '/wibble'
    , 'returns path where missing variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: null }), '/wibble'
    , 'returns path where null variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: undefined }), '/wibble'
    , 'returns path where undefined variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: '' }), '/wibble'
    , 'returns path where empty variable is removed when being interpolated')
})

test('Interpolating should handle missing, null, undefined and empty param in the middle of the path', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/{foo}/{bar}', { bar: 'bing' }), '/wibble/bing'
    , 'returns path where missing variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}/{bar}', { bar: 'bing', foo: null }), '/wibble/bing'
    , 'returns path where null variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}/{bar}', { bar: 'bing', foo: undefined }), '/wibble/bing'
    , 'returns path where undefined variable is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}/{bar}', { bar: 'bing', foo: '' }), '/wibble/bing'
    , 'returns path where empty variable is removed when being interpolated')
})
