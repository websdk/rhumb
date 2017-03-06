var test = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should replace the values of non-empty partial variables', function (t) {
  t.plan(12)

  var cases = [
        {
          input: '/page-{foo}'
        , expected: '/page-bing'
        }
      , {
          input: '/page-{foo}/'
        , expected: '/page-bing'
        }
      , {
          input: '/{foo}.v1/wobble'
        , expected: '/bing.v1/wobble'
        }
      , {
          input: '/{foo}.v1/wobble/'
        , expected: '/bing.v1/wobble'
        }
      , {
          input: '/wibble/__{foo}__'
        , expected: '/wibble/__bing__'
        }
      , {
          input: '/wibble/__{foo}__/'
        , expected: '/wibble/__bing__'
        }
      , {
          input: 'page-{foo}'
        , expected: '/page-bing'
        }
      , {
          input: 'page-{foo}/'
        , expected: '/page-bing'
        }
      , {
          input: '{foo}.v1/wobble'
        , expected: '/bing.v1/wobble'
        }
      , {
          input: '{foo}.v1/wobble/'
        , expected: '/bing.v1/wobble'
        }
      , {
          input: 'wibble/__{foo}__'
        , expected: '/wibble/__bing__'
        }
      , {
          input: 'wibble/__{foo}__/'
        , expected: '/wibble/__bing__'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: 'bing', bar: 'zap' }), testCase.expected
      , 'returns path where partial variable substituted with their value')
  })
})

test('Interpolating should replace the values of non-empty partial variables in optional parts', function (t) {
  t.plan(6)

  var cases = [
        {
          input: '/wibble(/{foo}-{bar})'
        , expected: '/wibble/bing-zap'
        }
      , {
          input: '/wibble(/{foo}-part/part-{bar})'
        , expected: '/wibble/bing-part/part-zap'
        }
      , {
          input: '/wibble/(/{foo}-{bar})'
        , expected: '/wibble/bing-zap'
        }
      , {
          input: '/wibble/(/{foo}-part/part-{bar})'
        , expected: '/wibble/bing-part/part-zap'
        }
      , {
          input: 'wibble(/{foo}-{bar})'
        , expected: '/wibble/bing-zap'
        }
      , {
          input: 'wibble(/{foo}-part/part-{bar})'
        , expected: '/wibble/bing-part/part-zap'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: 'bing', bar: 'zap' }), testCase.expected
      , 'returns path where partial variable substituted with their value')
  })
})

test('Interpolating should replace the values of non-empty partial variables in nested optional parts', function (t) {
  t.plan(6)

  var cases = [
        {
          input: '/wibble(/{foo}-part(/part-{bar}))'
        , expected: '/wibble/bing-part/part-zap'
        }
      , {
          input: '/wibble(/{foo}-part(/part-{bar}(/part-{wobble}-part)))'
        , expected: '/wibble/bing-part/part-zap/part-wobble-part'
        }
      , {
          input: '/wibble(/{foo}-part/(/part-{bar}))'
        , expected: '/wibble/bing-part/part-zap'
        }
      , {
          input: '/wibble(/{foo}-part/(/part-{bar}(/part-{wobble}-part)))'
        , expected: '/wibble/bing-part/part-zap/part-wobble-part'
        }
      , {
          input: 'wibble(/{foo}-part(/part-{bar}))'
        , expected: '/wibble/bing-part/part-zap'
        }
      , {
          input: 'wibble(/{foo}-part(/part-{bar}(/part-{wobble}-part)))'
        , expected: '/wibble/bing-part/part-zap/part-wobble-part'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: 'bing', bar: 'zap', wobble: 'wobble' }), testCase.expected
      , 'returns path where partial variable substituted with their value')
  })
})

test('Interpolating should drop optional and nested optional parts that contain an empty, null, undefined and missing partial variables', function(t) {
  t.plan(24)

  var cases = [
        {
          input: '/wibble(/{foo}-end)'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/start-{foo})'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/start-{foo}-end)'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/{foo}-part)'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/{foo}-{bar}/wobble)'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/{foo}-{bar}/part-{bar})'
        , expected: '/wibble'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: '', bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when partial variable is empty')

    t.equal(rhumb.interpolate(testCase.input, { bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when partial variable is missing')

    t.equal(rhumb.interpolate(testCase.input, { foo: null, bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when partial variable is null')

    t.equal(rhumb.interpolate(testCase.input, { foo: undefined, bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when partial variable is undefined')
  })
})
