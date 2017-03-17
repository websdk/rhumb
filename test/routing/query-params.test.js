var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , queryStringInRouteError = /Invalid route: Must not contain a query string/

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

test('Routing should throw an error when adding a route with a query string', function (t) {
  t.plan(5)
  var router = rhumb.create()

  t.throws(function () {
    router.add('/sing?foo=bar&baz=bam')
  }, queryStringInRouteError)

  t.throws(function () {
    router.add('/sing/bird-song?foo=bar&baz=bam')
  }, queryStringInRouteError)

  t.throws(function () {
    router.add('/sing/bird-song?foo=&bar&baz=bop')
  }, queryStringInRouteError)

  t.throws(function () {
    router.add('/sing?foo=&')
  }, queryStringInRouteError)

  t.throws(function () {
    router.add('/sing/bird-song?sound=bark')
  }, queryStringInRouteError)
})
