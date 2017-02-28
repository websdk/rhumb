var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test("Routing should pass query string params to callback", function(t) {
  var router = rhumb.create()

  t.plan(1)
  router.add("/sing", function(params) {
    t.deepEquals(params,
      { foo: "bar"
      , baz: "bam"
      }
    )
  })

  router.match("/sing?foo=bar&baz=bam")
})

test("Routing should pass query string params and path params to callback", function(t) {
  var router = rhumb.create()

  t.plan(1)
  router.add("/sing/{sound}", function(params) {
    t.deepEquals(params,
      { sound : "bird-song"
      , foo : "bar"
      , baz : "bam"
      }
    )
  })

  router.match("/sing/bird-song?foo=bar&baz=bam")
})

test("Routing should add query string params without values as undefined", function(t) {
  var router = rhumb.create()

  t.plan(1)
  router.add("/sing/{sound}", function(params) {
    t.deepEquals(params,
      { sound : "bird-song"
      , foo : undefined
      , bar : undefined
      , baz : "bop"
      }
    )
  })

  router.match("/sing/bird-song?foo=&bar&baz=bop")
})

test("Routing should handle incomplete query strings", function(t) {
  var router = rhumb.create()

  t.plan(1)
  router.add("/sing", function(params) {
    t.deepEquals(params, { foo: undefined })
  })

  router.match("/sing?foo=&")
})

test("Routing should not overwrite path params with query params", function(t) {
  var router = rhumb.create()

  t.plan(1)
  router.add("/sing/{sound}", function(params) {
    t.deepEquals(params, { sound: "bird-song" })
  })

  router.match("/sing/bird-song?sound=bark")
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
