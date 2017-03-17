var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , optionalPathError = /Invalid path: Must not contain an optional path/

test("Routing should match /foo(/bar) with /foo and /foo/bar", function(t) {
  t.plan(2)
  var router = rhumb.create()

  router.add("/foo(/bar)", function() {
    t.pass("should be called")
  })

  router.match("/foo")
  router.match("/foo/bar")
})

test("Routing should match /foo(/{bar}(/{bay})) with /foo, /foo/knew & /foo/knew/you", function(t) {
  t.plan(6)
  var router = rhumb.create()

  router.add("/foo(/{bar}(/{bay}))", function(params) {
    t.pass("should be called")

    params.bar && t.equal(params.bar, "knew")
    params.bay && t.equal(params.bay, "you")
  })

  router.match("/foo")
  router.match("/foo/knew")
  router.match("/foo/knew/you")
})

test('Routing should throw an error for matching paths with optional parts', function (t) {
  t.plan(3)
  var router = rhumb.create()

  router.add('/foo(/bar(/bing))', function () {})

  t.throws(function () {
    router.match('/foo(/bar)')
  }, optionalPathError)

  t.throws(function () {
    router.match('/foo(/bar/bing)')
  }, optionalPathError)

  t.throws(function () {
    router.match('/foo/bar(/bing)')
  }, optionalPathError)
})
