var test = require('tape')
  , rhumb = require('../../src/rhumb')

test('Interpolating should not throw errors for valid empty paths', function (t) {
  t.plan(2)

  t.doesNotThrow(function () {
    rhumb.interpolate('/', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('', {})
  }, 'does not throw as path is known to be valid')
})

test('Interpolating should not throw errors for valid fixed paths', function (t) {
  t.plan(8)

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo/', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo/', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo/bar', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo/bar/', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo/bar', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo/bar/', {})
  }, 'does not throw as path is known to be valid')
})

test('Interpolating should not throw errors for valid fixed optional and nested paths', function (t) {
  t.plan(8)

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo(/bar)', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo(/bar/)', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo(/bar)', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo(/bar/)', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo(/bar(/bing))', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo(/bar(/bing/))', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo(/bar(/bing))', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo(/bar(/bing/))', {})
  }, 'does not throw as path is known to be valid')
})

test('Interpolating should not throw errors for slashes before valid fixed optional and nested paths', function (t) {
  t.plan(4)

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo/(/bar/)', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo/(/bar/)', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('/foo/(/bar(/bing/))', {})
  }, 'does not throw as path is known to be valid')

  t.doesNotThrow(function () {
    rhumb.interpolate('foo/(/bar(/bing/))', {})
  }, 'does not throw as path is known to be valid')
})

test('Interpolating should only throw errors for empty, null, undefined and missing variables', function (t) {
  t.plan(16)

  var cases = [
        {
          params: { foo: '', bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is an empty value/
        , message: 'throws an error as required variable is empty'
        }
      , {
          params: { bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is not supplied/
        , message: 'throws an error as required variable is missing'
        }
      , {
          params: { foo: null, bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is null/
        , message: 'throws an error as required variable is null'
        }
      , {
          params: { foo: undefined, bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is undefined/
        , message: 'throws an error as required variable is undefined'
        }
      ]

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/{foo}', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/{foo}/wobble', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/wibble/{foo}', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/wibble/{foo}/{bar}/wobble', testCase.params)
    }, testCase.expectedError, testCase.message)
  })
})

test('Interpolating should throw only errors for empty, null, undefined and missing partial variables', function (t) {
  t.plan(24)

  var cases = [
        {
          params: { foo: '', bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is an empty value/
        , message: 'throws an error as required partial variable is empty'
        }
      , {
          params: { bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is not supplied/
        , message: 'throws an error as required partial variable is missing'
        }
      , {
          params: { foo: null, bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is null/
        , message: 'throws an error as required partial variable is null'
        }
      , {
          params: { foo: undefined, bar: 'wobble' }
        , expectedError: /Invalid parameter: "foo" is undefined/
        , message: 'throws an error as required partial variable is undefined'
        }
      ]

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/{foo}-end', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/start-{foo}', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/start-{foo}-end', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/wibble/{foo}-part', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/wibble/{foo}-part/wobble', testCase.params)
    }, testCase.expectedError, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.throws(function () {
      rhumb.interpolate('/wibble/{foo}-{bar}/wobble', testCase.params)
    }, testCase.expectedError, testCase.message)
  })
})

test('Interpolating should not throw errors when optional and nested optional parts contain an empty, null, undefined and missing variables', function (t) {
  t.plan(20)

  var cases = [
        {
          params: { foo: 'bing', bar: 'wobble' }
        , message: 'does not throw as all variables are found'
        }
      , {
          params: { foo: '', bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when variable is empty'
        }
      , {
          params: { bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when variable is missing'
        }
      , {
          params: { foo: null, bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when variable is null'
        }
      , {
          params: { foo: undefined, bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when variable is undefined'
        }
      ]

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo})', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo}/wobble)', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo}/{bar})', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo}(/{bar}))', testCase.params)
    }, testCase.message)
  })
})

test('Interpolating should not throw errors when optional and nested optional parts contain an empty, null, undefined and missing partial variables', function (t) {
  t.plan(30)

  var cases = [
        {
          params: { foo: 'bing', bar: 'wobble' }
        , message: 'does not throw as all partial variables are found'
        }
      , {
          params: { foo: '', bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when partial variable is empty'
        }
      , {
          params: { bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when partial variable is missing'
        }
      , {
          params: { foo: null, bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when partial variable is null'
        }
      , {
          params: { foo: undefined, bar: 'wobble' }
        , message: 'does not throw as optional path can be dropped when partial variable is undefined'
        }
      ]

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo}-end)', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/start-{foo})', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/start-{foo}-end)', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo}-part)', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo}-{bar}/wobble)', testCase.params)
    }, testCase.message)
  })

  cases.forEach(function (testCase) {
    t.doesNotThrow(function () {
      rhumb.interpolate('/wibble(/{foo}-{bar}/part-{bar})', testCase.params)
    }, testCase.message)
  })
})
