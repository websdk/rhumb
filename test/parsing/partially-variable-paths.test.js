var test  = require('tape')
  , rhumb = require('../../src/rhumb')

var root = { type: 'fixed', input: '/' }

test("Parsing should find a partial part with fixed left and right", function(t) {
  var out = rhumb._parse("/left{page}right")

  t.plan(6)
  t.ok(out)
  t.equal(out.length, 2)
  t.deepEqual(out[0], root)
  t.equal(out[1].name, 'left{var}right')
  t.equal(out[1].type, 'partial')
  t.deepEqual(out[1].vars, ['page'])
})
test("Parsing should find a partial part with fixed right", function(t) {
  var out = rhumb._parse("/{page}right")

  t.plan(6)
  t.ok(out)
  t.equal(out.length, 2)
  t.deepEqual(out[0], root)
  t.equal(out[1].name, '{var}right')
  t.equal(out[1].type, 'partial')
  t.deepEqual(out[1].vars, ['page'])
})
test("Parsing should find a partial part with fixed left", function(t) {
  var out = rhumb._parse("/left{page}")

  t.plan(6)
  t.ok(out)
  t.equal(out.length, 2)
  t.deepEqual(out[0], root)
  t.equal(out[1].name, 'left{var}')
  t.equal(out[1].type, 'partial')
  t.deepEqual(out[1].vars, ['page'])
})