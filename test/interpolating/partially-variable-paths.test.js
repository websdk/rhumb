var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should return correct path for /page-{num}', function(t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/page-{num}', { num: 'four' }), '/page-four'
    , 'returns path /page-four')
})

test('Interpolating should return correct path for /page-{num}', function(t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/page-{num}', { num: '4' }), '/page-4'
    , 'returns path /page-4')
})

test('Interpolating should return correct path for /i-{action}-you', function(t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/i-{action}-you', { action: 'poke' }), '/i-poke-you'
    , 'returns path /i-poke-you')
})

test('Interpolating should return correct path for /fix/i-{action}-you/faff', function(t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/fix/i-{action}-you/faff', { action: 'poke' }), '/fix/i-poke-you/faff'
    , 'returns path /fix/i-poke-you/faff')
})

test('Interpolating should return correct path for /fix/i-{action}-you/faff when param is empty', function(t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/fix/i-{action}-you/faff', { action: '' }), '/fix/faff'
    , 'returns path /fix/i-poke-you/faff')
})

test('Interpolating should return correct path for /{day}-{month}-{year}', function(t) {
  t.plan(1)

  t.equal(rhumb.interpolate('/{day}-{month}-{year}', { day: 'mon', month: '01', year: '2020' }), '/mon-01-2020'
    , 'returns path /mon-01-2020')
})


test('Interpolating should handle encoding a non-empty param', function (t) {
  t.plan(2)

  t.equal(rhumb.interpolate('/wibble/foo-{bar}', { bar: 'Hello bar' }), '/wibble/foo-Hello%20bar'
    , 'returns path where partial variables substituted with encoded value when being interpolated')

  t.equal(rhumb.interpolate('/wibble/foo-{bar}', { bar: 'Hello%20bar' }), '/wibble/foo-Hello%2520bar'
    , 'returns path where variable substituted with encoded value when being interpolated')
})

test('Interpolating should handle missing, null, undefined and empty param', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/foo-{bar}', {}), '/'
    , 'returns path where missing partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/foo-{bar}', { bar: null }), '/'
    , 'returns path where null partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/foo-{bar}', { bar: undefined }), '/'
    , 'returns path where undefined partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/foo-{bar}', { bar: '' }), '/'
    , 'returns path where empty partial part is removed when being interpolated')

})

test('Interpolating should handle missing, null, undefined and empty param after a fixed part', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/foo-{bar}-wobble', {}), '/wibble'
    , 'returns path where missing partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/foo-{bar}-wobble', { bar: null }), '/wibble'
    , 'returns path where null partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/foo-{bar}-wobble', { bar: undefined }), '/wibble'
    , 'returns path where undefined partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/foo-{bar}-wobble', { bar: '' }), '/wibble'
    , 'returns path where empty partial part is removed when being interpolated')
})

test('Interpolating should handle missing, null, undefined and empty param in the middle of the path', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/{foo}-bar/wobble', {}), '/wibble/wobble'
    , 'returns path where missing partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}-bar/wobble', { foo: null }), '/wibble/wobble'
    , 'returns path where null partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}-bar/wobble', { foo: undefined }), '/wibble/wobble'
    , 'returns path where undefined partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{foo}-bar/wobble', { foo: '' }), '/wibble/wobble'
    , 'returns path where empty partial part is removed when being interpolated')
})

test('Interpolating should handle missing, null, undefined and empty param with multiple partial variables', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/{day}-{month}-{year}', { month: '01', year: '2020' }), '/wibble'
    , 'returns path where missing partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{day}-{month}-{year}', { day: null, month: '01', year: '2020' }), '/wibble'
    , 'returns path where null partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{day}-{month}-{year}', { day: undefined, month: '01', year: '2020' }), '/wibble'
    , 'returns path where undefined partial part is removed when being interpolated')

  t.equal(rhumb.interpolate('/wibble/{day}-{month}-{year}', { day: '', month: '01', year: '2020' }), '/wibble'
    , 'returns path where empty partial part is removed when being interpolated')
})
