var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , partialVariableSegmentPathError = /Invalid path: Must not contain a partial variable segment/

test("Routing should match /page-{num} with path /page-four", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/page-{num}", function(params) {
    t.deepEqual(params, { num : "four" })
  })

  router.match("/page-four")
})

test("Routing should match /page-{num} with path /page-4", function(t) {
  t.plan(1)

  var router = rhumb.create()

  router.add("/page-{num}", function(params) {
    t.deepEqual(params, { num : "4" })
  })

  router.match("/page-4")
})

test("Routing should match /i-{action}-you with path /i-poke-you", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/i-{action}-you", function(params) {
    t.deepEqual(params, { action: "poke" })
  })

  router.match("/i-poke-you")
})

test("Routing should match /fix/i-{action}-you/faff with path /fix/i-poke-you/faff", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/fix/i-{action}-you/faff", function(params) {
    t.deepEqual(params, { action: "poke" })
  })

  router.match("/fix/i-poke-you/faff")
})

test("Routing should match /{day}-{month}-{year} with path /mon-01-2020", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/{day}-{month}-{year}", function(params) {
    t.deepEqual(params, { day: "mon", month: "01", year: "2020" })
  })

  router.match("mon-01-2020")
})

test('Routing should throw an error for matching paths with partial variable segments', function (t) {
  t.plan(3)
  var router = rhumb.create()

  router.add('/{foo}-part', function () {})
  router.add('/part-{foo}/{bar}-part', function () {})

  t.throws(function () {
    router.match('/{foo}-part')
  }, partialVariableSegmentPathError)

  t.throws(function () {
    router.match('/part-{foo}/bing-part')
  }, partialVariableSegmentPathError)

  t.throws(function () {
    router.match('/part-foo/{bar}-part')
  }, partialVariableSegmentPathError)
})
