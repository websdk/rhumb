var test = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle single non-empty variable paths', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/{foo}', { foo: 'bing' }), '/bing'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('{foo}', { foo: 'bing' }), 'bing'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/{foo}/', { foo: 'bing' }), '/bing/'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('{foo}/', { foo: 'bing' }), 'bing/'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with a non-empty variable segment followed by fixed segment', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/{foo}/wobble', { foo: 'bing' }), '/bing/wobble'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('{foo}/wobble', { foo: 'bing' }), 'bing/wobble'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/{foo}/wobble/', { foo: 'bing' }), '/bing/wobble/'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('{foo}/wobble/', { foo: 'bing' }), 'bing/wobble/'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with a non-empty variable segment preceding a fixed segment', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/{foo}', { foo: 'bing' }), '/wibble/bing'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble/{foo}', { foo: 'bing' }), 'wibble/bing'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble/{foo}/', { foo: 'bing' }), '/wibble/bing/'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble/{foo}/', { foo: 'bing' }), 'wibble/bing/'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with a non-empty variable segment between fixed segments', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/{foo}/wobble', { foo: 'bing' }), '/wibble/bing/wobble'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble/{foo}/wobble', { foo: 'bing' }), 'wibble/bing/wobble'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble/{foo}/wobble/', { foo: 'bing' }), '/wibble/bing/wobble/'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble/{foo}/wobble/', { foo: 'bing' }), 'wibble/bing/wobble/'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with multiple non-empty variable segments', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/{foo}/{bar}', { foo: 'bing', bar: 'zap' }), '/wibble/bing/zap'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble/{foo}/{bar}', { foo: 'bing', bar: 'zap' }), 'wibble/bing/zap'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble/{foo}/{bar}/', { foo: 'bing', bar: 'zap' }), '/wibble/bing/zap/'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble/{foo}/{bar}/', { foo: 'bing', bar: 'zap' }), 'wibble/bing/zap/'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with non-empty variable segments in optional parts', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/{foo})', { foo: 'bing' }), '/wibble/bing'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo})', { foo: 'bing' }), 'wibble/bing'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/{foo}/)', { foo: 'bing' }), '/wibble/bing/'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}/)', { foo: 'bing' }), 'wibble/bing/'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with non-empty variable segments in nested optional parts', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/{foo}(/{bar}))', { foo: 'bing', bar: 'zap' }), '/wibble/bing/zap'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}(/{bar}))', { foo: 'bing', bar: 'zap' }), 'wibble/bing/zap'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/{foo}(/{bar}/))', { foo: 'bing', bar: 'zap' }), '/wibble/bing/zap/'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}(/{bar}/))', { foo: 'bing', bar: 'zap' }), 'wibble/bing/zap/'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle single non-empty variable paths with query params with query params', function (t) {
  t.plan(8)

  t.equal(rhumb.interpolate('/{foo}?q=value', { foo: 'bing' }), '/bing?q=value'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('{foo}?q=value', { foo: 'bing' }), 'bing?q=value'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/{foo}/?q=value', { foo: 'bing' }), '/bing/?q=value'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('{foo}/?q=value', { foo: 'bing' }), 'bing/?q=value'
    , 'interpolates variable and keeps trailing slash when provided')

  t.equal(rhumb.interpolate('/{foo}/wobble?q=value', { foo: 'bing' }), '/bing/wobble?q=value'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('{foo}/wobble?q=value', { foo: 'bing' }), 'bing/wobble?q=value'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/{foo}/wobble/?q=value', { foo: 'bing' }), '/bing/wobble/?q=value'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('{foo}/wobble/?q=value', { foo: 'bing' }), 'bing/wobble/?q=value'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with non-empty variable segments in optional parts with query params', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/{foo})?q=value', { foo: 'bing' }), '/wibble/bing?q=value'
    , 'interpolates variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo})?q=value', { foo: 'bing' }), 'wibble/bing?q=value'
    , 'interpolates variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/{foo}/)?q=value', { foo: 'bing' }), '/wibble/bing/?q=value'
    , 'interpolates variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}/)?q=value', { foo: 'bing' }), 'wibble/bing/?q=value'
    , 'interpolates variable and keeps trailing slash when provided')
})

test('Interpolating should drop optional and nested optional parts that contain an empty, null, undefined and missing variables', function (t) {
  t.plan(16)

  var cases = [
        {
          params: { foo: '', bar: 'wobble' }
        , message: 'returns path without the optional part when variable is empty'
        }
      , {
          params: { bar: 'wobble' }
        , message: 'returns path without the optional part when variable is missing'
        }
      , {
          params: { foo: null, bar: 'wobble' }
        , message: 'returns path without the optional part when variable is null'
        }
      , {
          params: { foo: undefined, bar: 'wobble' }
        , message: 'returns path without the optional part when variable is undefined'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo})', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo}/wobble)', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo}/{bar})', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo}(/{bar}))', testCase.params), '/wibble'
      , testCase.message)
  })
})
