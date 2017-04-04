var test = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle single non-empty partial variable paths', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/page-{foo}', { foo: 'bing' }), '/page-bing'
    , 'interpolates partial variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('page-{foo}', { foo: 'bing' }), 'page-bing'
    , 'interpolates partial variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/page-{foo}/', { foo: 'bing' }), '/page-bing/'
    , 'interpolates partial variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('page-{foo}/', { foo: 'bing' }), 'page-bing/'
    , 'interpolates partial variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with a non-empty partial variable segment followed by fixed segment', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/{foo}.v1/wobble', { foo: 'bing' }), '/bing.v1/wobble'
    , 'interpolates partial variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('{foo}.v1/wobble', { foo: 'bing' }), 'bing.v1/wobble'
    , 'interpolates partial variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/{foo}.v1/wobble/', { foo: 'bing' }), '/bing.v1/wobble/'
    , 'interpolates partial variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('{foo}.v1/wobble/', { foo: 'bing' }), 'bing.v1/wobble/'
    , 'interpolates partial variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with a non-empty partial variable segment preceding a fixed segment', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble/__{foo}__', { foo: 'bing' }), '/wibble/__bing__'
    , 'interpolates partial variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble/__{foo}__', { foo: 'bing' }), 'wibble/__bing__'
    , 'interpolates partial variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble/__{foo}__/', { foo: 'bing' }), '/wibble/__bing__/'
    , 'interpolates partial variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble/__{foo}__/', { foo: 'bing' }), 'wibble/__bing__/'
    , 'interpolates partial variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with non-empty partial variable segments in optional parts', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/{foo}-part/part-{bar})', { foo: 'bing', bar: 'zap' }), '/wibble/bing-part/part-zap'
    , 'interpolates partial variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}-part/part-{bar})', { foo: 'bing', bar: 'zap' }), 'wibble/bing-part/part-zap'
    , 'interpolates partial variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/{foo}-part/part-{bar}/)', { foo: 'bing', bar: 'zap' }), '/wibble/bing-part/part-zap/'
    , 'interpolates partial variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}-part/part-{bar}/)', { foo: 'bing', bar: 'zap' }), 'wibble/bing-part/part-zap/'
    , 'interpolates partial variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with non-empty partial variable segments in nested optional parts', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/{foo}-part(/part-{bar}))', { foo: 'bing', bar: 'zap' }), '/wibble/bing-part/part-zap'
    , 'interpolates partial variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}-part(/part-{bar}))', { foo: 'bing', bar: 'zap' }), 'wibble/bing-part/part-zap'
    , 'interpolates partial variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/{foo}-part(/part-{bar}/))', { foo: 'bing', bar: 'zap' }), '/wibble/bing-part/part-zap/'
    , 'interpolates partial variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}-part(/part-{bar}/))', { foo: 'bing', bar: 'zap' }), 'wibble/bing-part/part-zap/'
    , 'interpolates partial variable and keeps trailing slash when provided')
})

test('Interpolating should handle single non-empty partial variable paths with query params', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/page-{foo}?q=value', { foo: 'bing' }), '/page-bing?q=value'
    , 'interpolates partial variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('page-{foo}?q=value', { foo: 'bing' }), 'page-bing?q=value'
    , 'interpolates partial variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/page-{foo}/?q=value', { foo: 'bing' }), '/page-bing/?q=value'
    , 'interpolates partial variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('page-{foo}/?q=value', { foo: 'bing' }), 'page-bing/?q=value'
    , 'interpolates partial variable and keeps trailing slash when provided')
})

test('Interpolating should handle paths with non-empty partial variable segments in optional parts with query params', function (t) {
  t.plan(4)

  t.equal(rhumb.interpolate('/wibble(/{foo}-part/part-{bar})?q=value', { foo: 'bing', bar: 'zap' }), '/wibble/bing-part/part-zap?q=value'
    , 'interpolates partial variable and keeps leading slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}-part/part-{bar})?q=value', { foo: 'bing', bar: 'zap' }), 'wibble/bing-part/part-zap?q=value'
    , 'interpolates partial variable and keeps path unmodified when no leading slash')
  t.equal(rhumb.interpolate('/wibble(/{foo}-part/part-{bar}/)?q=value', { foo: 'bing', bar: 'zap' }), '/wibble/bing-part/part-zap/?q=value'
    , 'interpolates partial variable and keeps leading and trailing slash when provided')
  t.equal(rhumb.interpolate('wibble(/{foo}-part/part-{bar}/)?q=value', { foo: 'bing', bar: 'zap' }), 'wibble/bing-part/part-zap/?q=value'
    , 'interpolates partial variable and keeps trailing slash when provided')
})

test('Interpolating should drop optional and nested optional parts that contain an empty, null, undefined and missing partial variables', function (t) {
  t.plan(24)

  var cases = [
        {
          params: { foo: '', bar: 'wobble' }
        , message: 'returns path without the optional part when partial variable is empty'
        }
      , {
          params: { bar: 'wobble' }
        , message: 'returns path without the optional part when partial variable is missing'
        }
      , {
          params: { foo: null, bar: 'wobble' }
        , message: 'returns path without the optional part when partial variable is null'
        }
      , {
          params: { foo: undefined, bar: 'wobble' }
        , message: 'returns path without the optional part when partial variable is undefined'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo}-end)', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/start-{foo})', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/start-{foo}-end)', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo}-part)', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo}-{bar}/wobble)', testCase.params), '/wibble'
      , testCase.message)
  })

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate('/wibble(/{foo}-{bar}/part-{bar})', testCase.params), '/wibble'
      , testCase.message)
  })
})
