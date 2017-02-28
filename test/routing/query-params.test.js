var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test("Routing should pass query string params to callback", function(t) {
  t.plan(2)

  utils.performMatch('/foo', '/foo?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })

  utils.performMatch('/foo/bar/bing', '/foo/bar/bing?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })
})

test("Routing should pass query string params and path params to callback", function(t) {
  t.plan(1)

  utils.performMatch('/wibble/{wobble}', '/wibble/foo?q=value', function (params) {
    t.deepEqual(params, { wobble: 'foo', q: 'value' }
      , 'path should match without overwriting path params with query params')
  })
})

test("Routing should add query string params without values as undefined", function(t) {
  t.plan(1)

  utils.performMatch('/wibble', '/wibble?foo=&bar&bing=value', function (params) {
    t.deepEqual(params, { foo: undefined, bar: undefined, bing: 'value' }
      , 'path should match with empty and non-empty query params included in params list')
  })
})

test("Routing should handle incomplete query strings", function(t) {
  t.plan(1)

  utils.performMatch('/wibble', '/wibble?foo=bar&bing&', function (params) {
    t.deepEqual(params, { foo: 'bar', bing: undefined }
      , 'path should match with complete and incomplete query params included in params list')
  })
})

test("Routing should not overwrite path params with query params", function(t) {
  t.plan(1)

  utils.performMatch('/wibble/{wobble}', '/wibble/foo?wobble=bar', function (params) {
    t.deepEqual(params, { wobble: 'foo' }
      , 'path should match without overwriting path params with query params')
  })
})

test('Routing should handle zero parts', function (t) {
  t.plan(2)

  utils.performMatch('', '/?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })

  utils.performMatch('/', '/?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })
})

test('Routing should handle a optional path with parts', function (t) {
  t.plan(2)

  utils.performMatch('/wibble(/foo)', '/wibble/foo?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })

  utils.performMatch('/wibble(/foo/bar)', '/wibble/foo/bar?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })
})

test('Routing should handle a nested optional path with parts', function (t) {
  t.plan(2)

  utils.performMatch('/wibble(/foo(/bing))', '/wibble/foo/bing?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })

  utils.performMatch('/wibble(/foo/bar(/bing))', '/wibble/foo/bar/bing?q=value', function (params) {
    t.deepEquals(params, { q: 'value' }
      , 'path should match with query params included in params list')
  })
})

test('Routing should handle multiple query params', function (t) {
  t.plan(2)

  utils.performMatch('/wibble', '/wibble?foo=bar&bing=value', function (params) {
    t.deepEqual(params, { foo: 'bar', bing: 'value' }
      , 'path should match with query params included in params list')
  })

  utils.performMatch('/wibble/wobble', '/wibble/wobble?foo=bar&bing=value', function (params) {
    t.deepEqual(params, { foo: 'bar', bing: 'value' }
      , 'path should match with query params included in params list')
  })
})
