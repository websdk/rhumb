var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test("Routing should match /{foo} with path /bar", function(t) {
  t.plan(1)

  utils.performMatch('/{foo}', '/bar', function (params) {
    t.deepEqual(params, { foo: 'bar' }
      , 'path should match with params included in params list')
  })
})

test("Routing should match /wibble/{foo} with path /wibble/bean", function(t) {
  t.plan(1)

  utils.performMatch('/wibble/{foo}', '/wibble/bean', function (params) {
    t.deepEqual(params, { foo: 'bean' }
      , 'path should match with params included in params list')
  })
})

test("Routing should match /wibble/{foo}/wobble with path /wibble/humm/wobble", function(t) {
  t.plan(1)

  utils.performMatch('/wibble/{foo}/wobble', '/wibble/humm/wobble', function (params) {
    t.deepEqual(params, { foo: 'humm' }
      , 'path should match with params included in params list')
  })
})

test("Routing should match /foo/{bar} and /foo/{bar}/{baz} as different paths", function(t) {
  t.plan(2)

  var router = rhumb.create()

  router.add("/foo/{bar}", function(params) {
    t.deepEqual(params, { bar: "one" })
  })

  router.add("/foo/{bar}/{baz}", function(params) {
    t.deepEqual(params, { bar: "two", baz: "three" })
  })

  router.match("/foo/one")
  router.match("/foo/two/three")
})

test("Routing should decode variable parts", function(t) {
  t.plan(1)

  utils.performMatch('/{package}', '/%40scope%2Fpackage', function (params) {
    t.deepEqual(params, { package: '@scope/package' }
      , 'path should match with decoded params included in params list')
  })
})
