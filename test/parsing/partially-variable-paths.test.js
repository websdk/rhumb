var test  = require('tape')
  , rhumb = require('../../src/rhumb')

var root = { type: 'fixed', input: '/' }

function regexEqual(x, y) {
    return (x instanceof RegExp) && (y instanceof RegExp)
        && (x.source === y.source) && (x.global === y.global)
        && (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline)
}

test("Parsing should find a partial part with fixed left and right", function(t) {
  var out = rhumb._parse("/left{page}right")

  t.plan(7)
  t.ok(out, "returns parsed data")
  t.equal(out.length, 2)
  t.deepEqual(out[0], root)
  t.equal(out[1].name, 'left{var}right')
  t.equal(out[1].type, 'partial')
  t.deepEqual(out[1].vars, ['page'])
  t.ok(regexEqual(out[1].input, /left([A-Za-z0-9%]+)right/), "has the correct regex")
})
test("Parsing should find a partial part with fixed right", function(t) {
  var out = rhumb._parse("/{page}right")

  t.plan(7)
  t.ok(out, "returns parsed data")
  t.equal(out.length, 2)
  t.deepEqual(out[0], root)
  t.equal(out[1].name, '{var}right')
  t.equal(out[1].type, 'partial')
  t.deepEqual(out[1].vars, ['page'])
  t.ok(regexEqual(out[1].input, /([A-Za-z0-9%]+)right/), "has the correct regex")
})
test("Parsing should find a partial part with fixed left", function(t) {
  var out = rhumb._parse("/left{page}")

  t.plan(7)
  t.ok(out, "returns parsed data")
  t.equal(out.length, 2)
  t.deepEqual(out[0], root)
  t.equal(out[1].name, 'left{var}')
  t.equal(out[1].type, 'partial')
  t.deepEqual(out[1].vars, ['page'])
  t.ok(regexEqual(out[1].input, /left([A-Za-z0-9%]+)/), "has the correct regex")
})
