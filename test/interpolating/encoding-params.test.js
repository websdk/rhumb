var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should handle encoding when a non-empty variable name contains special characters', function (t) {
  t.plan(3)
  var cases = [
        {
          input: '/wibble/{date%2Dof%2Dbirth}'
        , params: { 'date-of-birth': 'bar' }
        , expected: '/wibble/bar'
        }
      , {
          input: '/wibble/{ns%2Fname}'
        , params: { 'ns/name': 'bar' }
        , expected: '/wibble/bar'
        }
      , {
          input: '/wibble/{ns%252Fname}'
        , params: { 'ns%2Fname': 'bar' }
        , expected: '/wibble/bar'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, testCase.params), testCase.expected
      , 'returns path where variable substituted value when being interpolated')
  })
})

test('Interpolating should handle encoding of a non-empty variable value contains special characters', function (t) {
  t.plan(3)
  var cases = [
        {
          input: '/wibble/{foo}'
        , params: { foo: '@scope/package' }
        , expected: '/wibble/%40scope%2Fpackage'
        }
      , {
          input: '/wibble/{foo}'
        , params: { foo: 'http://www.bing.com/search?q=query' }
        , expected: '/wibble/http%3A%2F%2Fwww%2Ebing%2Ecom%2Fsearch%3Fq%3Dquery'
        }
      , {
          input: '/wibble/{foo}'
        , params: { foo: 'specialchars(*-_~!\')' }
        , expected: '/wibble/specialchars%28%2A%2D%5F%7E%21%27%29'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, testCase.params), testCase.expected
      , 'returns path where variable substituted with encoded value when being interpolated')
  })
})

test('Interpolating should handle encoding of a non-empty partial variable value contains special characters', function (t) {
  t.plan(3)
  var cases = [
        {
          input: '/wibble/foo-{bar}'
        , params: { bar: 'Hello bar' }
        , expected: '/wibble/foo-Hello%20bar'
        }
      , {
          input: '/wibble/foo-{bar}'
        , params: { bar: 'Hello%20bar' }
        , expected: '/wibble/foo-Hello%2520bar'
        }
      , {
          input: '/{day}-{month}-{year}'
        , params: { day: '??', month: 'jan & may', year: '2020' }
        , expected: '/%3F%3F-jan%20%26%20may-2020'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, testCase.params), testCase.expected
      , 'returns path where variable substituted with encoded value when being interpolated')
  })
})

test('Interpolating should handle encoding of a non-empty variable value contains special characters inside an optional path', function (t) {
  t.plan(3)
  var cases = [
        {
          input: '/wibble/{foo}'
        , params: { foo: '@scope/package' }
        , expected: '/wibble/%40scope%2Fpackage'
        }
      , {
          input: '/wibble/{foo}'
        , params: { foo: 'http://www.bing.com/search?q=query' }
        , expected: '/wibble/http%3A%2F%2Fwww%2Ebing%2Ecom%2Fsearch%3Fq%3Dquery'
        }
      , {
          input: '/wibble/{foo}'
        , params: { foo: 'specialchars(*-_~!\')' }
        , expected: '/wibble/specialchars%28%2A%2D%5F%7E%21%27%29'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, testCase.params), testCase.expected
      , 'returns path where variable substituted with encoded value when being interpolated')
  })
})

test('Interpolating should handle encoding of a non-empty partial variable value contains special characters inside an optional path', function (t) {
  t.plan(3)
  var cases = [
        {
          input: '/wibble(/foo-{bar})'
        , params: { bar: 'Hello bar' }
        , expected: '/wibble/foo-Hello%20bar'
        }
      , {
          input: '/wibble(/foo-{bar})'
        , params: { bar: 'Hello%20bar' }
        , expected: '/wibble/foo-Hello%2520bar'
        }
      , {
          input: '/wibble(/{day}-{month}-{year})'
        , params: { day: '??', month: 'jan & may', year: '2020' }
        , expected: '/wibble/%3F%3F-jan%20%26%20may-2020'
        }
      ]

  cases.forEach(function (testCase) {
    t.equal(rhumb.interpolate(testCase.input, testCase.params), testCase.expected
      , 'returns path where partial variables substituted with encoded value when being interpolated')
  })
})
