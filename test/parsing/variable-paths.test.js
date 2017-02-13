var test  = require('tape')
  , rhumb = require('../../src/rhumb')

var root = { type: 'fixed', input: '/' }

test("Parsing should find single variable part", function(t) {
  var out = rhumb._parse("/{wibble}")

  t.plan(2)
  t.ok(out, "returns parsed data")
  t.deepEqual(out,
    [ root, { type: "var", input: "wibble" } ]
  )
})

test("Parsing should find multiple variable parts", function(t) {
  var out = rhumb._parse("/{wibble}/{wobble}")

  t.plan(2)
  t.ok(out, "returns parsed data")
  t.deepEqual(out,
    [ root
    , { type: "var", input: "wibble" }
    , { type: "var", input: "wobble" }
    ]
  )
})

test("Parsing should find variable and fixed parts", function(t) {
  var out = rhumb._parse("/{wibble}/bar/{wobble}")

  t.plan(2)
  t.ok(out, "returns parsed data")
  t.deepEqual(out,
    [ root
    , { type: "var", input: "wibble" }
    , { type: "fixed", input: "bar" }
    , { type: "var", input: "wobble" }
    ]
  )
})
