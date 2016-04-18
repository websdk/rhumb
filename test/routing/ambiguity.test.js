var test  = require('tape')
  , rhumb = require('../../src/rhumb')

test('Routing should detect /foo and (/foo) as ambiguous', function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add('/foo', function() {})

  t.throws(function() {
    router.add('(/foo)', function() {})
  })
})

test('Routing should detect /foo and /foo as ambiguous', function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add('/foo', function() {})

  t.throws(function() {
    router.add('/foo', function() {})
  })
})

test("Routing should detect /foo/{bar} and /foo/{maybe} as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo/{bar}", function() {})

  t.throws(function() {
    router.add("/foo/{maybe}", function() {})
  })
})

test("Routing should detect /foo/{bar} and /foo(/{maybe}) as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo/{bar}", function() {})

  t.throws(function() {
    router.add("/foo(/{maybe})", function() {})
  })
})

test("Routing should detect /foo/{bar} and /foo/{maybe} as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo(/{bar})", function() {})

  t.throws(function() {
    router.add("/foo/{maybe}", function() {})
  })
})

test("Routing should detect /foo(/{bar}) and /foo(/{maybe}) as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo(/{bar})", function() {})

  t.throws(function() {
    router.add("/foo(/{maybe})", function() {})
  })
})


test("Routing should detect /foo/moo{bar} and /foo/moo{maybe} as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo/moo{bar}", function() {})

  t.throws(function() {
    router.add("/foo/moo{maybe}", function() {})
  })
})

test("Routing should detect /foo/moo{bar} and /foo(/moo{maybe}) as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo/moo{bar}", function() {})

  t.throws(function() {
    router.add("/foo(/moo{maybe})", function() {})
  })
})

test("Routing should detect /foo/moo{bar} and /foo/moo{maybe} as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo(/moo{bar})", function() {})

  t.throws(function() {
    router.add("/foo/moo{maybe}", function() {})
  })
})

test("Routing should detect /foo(/moo{bar}) and /foo(/moo{maybe}) as ambiguous", function(t) {
  t.plan(1)
  var router = rhumb.create()

  router.add("/foo(/moo{bar})", function() {})

  t.throws(function() {
    router.add("/foo(/moo{maybe})", function() {})
  })
})