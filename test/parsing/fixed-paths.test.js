var test  = require('tape')
  , rhumb = require('../../src/rhumb')

var root = { type: 'fixed', input: '/' }

test('Parsing should always infer root', function(t) {
  t.plan(2)

  t.deepEqual(rhumb._parse(''), [ root ])
  t.deepEqual(rhumb._parse('/'), [ root ])
})

test("Parsing should find one fixed part", function(t) {
  var out = rhumb._parse("/foo")

  t.plan(1)
  t.deepEqual(out,
    [ root, { type: "fixed", input: "foo" } ]
  )
})

test("Parsing should find multiple fixed parts", function(t) {
  var out = rhumb._parse("/foo/bar/bing")

  t.plan(1)
  t.deepEqual(out,
    [ root
    , { type: "fixed", input: "foo"  }
    , { type: "fixed", input: "bar"  }
    , { type: "fixed", input: "bing" }
    ]
  )
})

test("Parsing should find single fixed part for /", function(t) {
  var out = rhumb._parse("/")

  t.plan(1)
  t.deepEqual(out,
    [ root ]
  )
})