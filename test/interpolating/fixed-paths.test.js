var test = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle fixed parts', function(t) {
  t.plan(10)
  var cases = [
        {
          input: '/'
        , expected: '/'
        }
      , {
          input: '/foo'
        , expected: '/foo'
        }
      , {
          input: '/foo/'
        , expected: '/foo'
        }
      , {
          input: '/foo/bar/bing'
        , expected: '/foo/bar/bing'
        }
      , {
          input: '/foo/bar/bing/'
        , expected: '/foo/bar/bing'
        }
      , {
          input: ''
        , expected: '/'
        }
      , {
          input: 'foo'
        , expected: '/foo'
        }
      , {
          input: 'foo/'
        , expected: '/foo'
        }
      , {
          input: 'foo/bar/bing'
        , expected: '/foo/bar/bing'
        }
      , {
          input: 'foo/bar/bing/'
        , expected: '/foo/bar/bing'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, {}), testCase.expected
      , 'returns path without modification when being interpolated')
  })
})

test('Interpolating should handle fixed parts in optional parts', function (t) {
  t.plan(12)
  var cases = [
        {
          input: '/wibble(/)'
        , expected: '/wibble'
        }
      , {
          input: '/wibble(/foo)'
        , expected: '/wibble/foo'
        }
      , {
          input: '/wibble(/foo/)'
        , expected: '/wibble/foo'
        }
      , {
          input: '/wibble(/foo/bar)'
        , expected: '/wibble/foo/bar'
        }
      , {
          input: '/wibble(/foo/bar/)'
        , expected: '/wibble/foo/bar'
        }
      , {
          input: '/wibble/(/foo/)'
        , expected: '/wibble/foo'
        }
      , {
          input: 'wibble(/)'
        , expected: '/wibble'
        }
      , {
          input: 'wibble(/foo)'
        , expected: '/wibble/foo'
        }
      , {
          input: 'wibble(/foo/)'
        , expected: '/wibble/foo'
        }
      , {
          input: 'wibble(/foo/bar)'
        , expected: '/wibble/foo/bar'
        }
      , {
          input: 'wibble(/foo/bar/)'
        , expected: '/wibble/foo/bar'
        }
      , {
          input: 'wibble/(/foo/)'
        , expected: '/wibble/foo'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, {}), testCase.expected
      , 'includes optional path when being interpolated')
  })
})

test('Interpolating should handle fixed parts in nested optional parts', function (t) {
  t.plan(8)
  var cases = [
        {
          input: '/wibble(/foo(/bing))'
        , expected: '/wibble/foo/bing'
        }
      , {
          input: '/wibble(/foo(/bing/))'
        , expected: '/wibble/foo/bing'
        }
      , {
          input: '/wibble(/foo(/bing/wobble))'
        , expected: '/wibble/foo/bing/wobble'
        }
      , {
          input: '/wibble(/foo(/bing/wobble/))'
        , expected: '/wibble/foo/bing/wobble'
        }
      , {
          input: 'wibble(/foo(/bing))'
        , expected: '/wibble/foo/bing'
        }
      , {
          input: 'wibble(/foo(/bing/))'
        , expected: '/wibble/foo/bing'
        }
      , {
          input: 'wibble(/foo(/bing/wobble))'
        , expected: '/wibble/foo/bing/wobble'
        }
      , {
          input: 'wibble(/foo(/bing/wobble/))'
        , expected: '/wibble/foo/bing/wobble'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, {}), testCase.expected
      , 'includes optional path when being interpolated')
  })
})
