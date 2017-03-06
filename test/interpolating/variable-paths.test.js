var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should replace the values of non-empty variables', function (t) {
  t.plan(20)

  var cases = [
        {
          input: '/{foo}'
        , expected: '/bing'
        }
      , {
          input: '/{foo}/'
        , expected: '/bing'
        }
      , {
          input: '/{foo}/wobble'
        , expected: '/bing/wobble'
        }
      , {
          input: '/{foo}/wobble/'
        , expected: '/bing/wobble'
        }
      , {
          input: '/wibble/{foo}'
        , expected: '/wibble/bing'
        }
      , {
          input: '/wibble/{foo}/'
        , expected: '/wibble/bing'
        }
      , {
          input: '/wibble/{foo}/wobble'
        , expected: '/wibble/bing/wobble'
        }
      , {
          input: '/wibble/{foo}/wobble/'
        , expected: '/wibble/bing/wobble'
        }
      , {
          input: '/wibble/{foo}/{bar}'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: '/wibble/{foo}/{bar}/'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: '{foo}'
        , expected: '/bing'
        }
      , {
          input: '{foo}/'
        , expected: '/bing'
        }
      , {
          input: '{foo}/wobble'
        , expected: '/bing/wobble'
        }
      , {
          input: '{foo}/wobble/'
        , expected: '/bing/wobble'
        }
      , {
          input: 'wibble/{foo}'
        , expected: '/wibble/bing'
        }
      , {
          input: 'wibble/{foo}/'
        , expected: '/wibble/bing'
        }
      , {
          input: 'wibble/{foo}/wobble'
        , expected: '/wibble/bing/wobble'
        }
      , {
          input: 'wibble/{foo}/wobble/'
        , expected: '/wibble/bing/wobble'
        }
      , {
          input: 'wibble/{foo}/{bar}'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: 'wibble/{foo}/{bar}/'
        , expected: '/wibble/bing/zap'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: 'bing', bar: 'zap' }), testCase.expected
      , 'returns path where variable substituted with their value')
  })
})

test('Interpolating should replace the values of non-empty variables in optional parts', function (t) {
  t.plan(6)

  var cases = [
        {
          input: '/wibble(/{foo})'
        , expected: '/wibble/bing'
        }
      , {
          input: '/wibble(/{foo}/{bar})'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: '/wibble/(/{foo})'
        , expected: '/wibble/bing'
        }
      , {
          input: '/wibble/(/{foo}/{bar})'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: 'wibble(/{foo})'
        , expected: '/wibble/bing'
        }
      , {
          input: 'wibble(/{foo}/{bar})'
        , expected: '/wibble/bing/zap'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: 'bing', bar: 'zap' }), testCase.expected
      , 'returns path where variable substituted with their value')
  })
})

test('Interpolating should replace the values of non-empty variables in nested optional parts', function (t) {
  t.plan(6)

  var cases = [
        {
          input: '/wibble(/{foo}(/{bar}))'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: '/wibble(/{foo}(/wobble(/{bar})))'
        , expected: '/wibble/bing/wobble/zap'
        }
      , {
          input: '/wibble(/{foo}/(/{bar}))'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: '/wibble(/{foo}/(/wobble(/{bar})))'
        , expected: '/wibble/bing/wobble/zap'
        }
      , {
          input: 'wibble(/{foo}(/{bar}))'
        , expected: '/wibble/bing/zap'
        }
      , {
          input: 'wibble(/{foo}(/wobble(/{bar})))'
        , expected: '/wibble/bing/wobble/zap'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: 'bing', bar: 'zap' }), testCase.expected
      , 'returns path where variable substituted with their value')
  })
})


test('Interpolating should drop optional and nested optional parts that contain an empty, null, undefined and missing variables', function(t) {
  t.plan(16)

  var cases = [
        {
          input: '/wibble(/{foo})'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/{foo}/wobble)'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/{foo}/{bar})'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/{foo}(/{bar}))'
        , expected: '/wibble'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, { foo: '', bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when variable is empty')

    t.equal(rhumb.interpolate(testCase.input, { bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when variable is missing')

    t.equal(rhumb.interpolate(testCase.input, { foo: null, bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when variable is null')

    t.equal(rhumb.interpolate(testCase.input, { foo: undefined, bar: 'wobble' }), testCase.expected
      , 'returns path without the optional part when variable is undefined')
  })
})
