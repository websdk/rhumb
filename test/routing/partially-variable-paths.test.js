var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

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

  router.match("/mon-01-2020")
})

test('Partially variable parts handles encoding a non-empty param', function (t) {
  t.plan(2)

  utils.performMatch('/wibble/foo-{bar}', '/wibble/foo-Hello%20bar', function (params) {
    t.deepEqual(params, { bar: 'Hello bar' }
      , 'path should match with params decoded and included in params list')
  })

  utils.performMatch('/wibble/foo-{bar}', '/wibble/foo-Hello%2520bar', function (params) {
    t.deepEqual(params, { bar: 'Hello%20bar' }
      , 'path should match with params decoded once and included in params list')
  })
})
