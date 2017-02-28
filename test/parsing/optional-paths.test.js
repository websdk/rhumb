var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

var root = { type: 'fixed', input: '/' }

test("Parsing should find optional part at end of path", function(t){
  var out = rhumb._parse("/one/two(/three)")

  t.plan(2)
  t.ok(out, "returns parsed data")
  t.deepEqual(out,
    [ root
    , { type: "fixed", input: "one"}
    , { type: "fixed", input: "two"}
    , [ { type: "fixed", input: "three"} ]
    ]
  )
})

test("Parsing should find nested optional elements at end of path", function(t){
  var out = rhumb._parse("/one/two(/three/four(/five))")

  t.plan(2)
  t.ok(out, "returns parsed data")
  t.deepEqual(out,
    [ root
    , { type: "fixed", input: "one"}
    , { type: "fixed", input: "two"}
    , [ { type: "fixed", input: "three"}
      , { type: "fixed", input: "four"}
      , [ { type: "fixed", input: "five"} ]
      ]
    ]
  )
})

/*
TODO: later :)
test("should find optional elements anywhere in path", function(t){
  var out = rhumb._parse("/one/two(/three)/gogogo")

  t.plan(2)
  t.ok(out)
  t.deepEqual(out,
    [ { type: "fixed", input: "one"}
    , { type: "fixed", input: "two"}
    , [ { type: "fixed", input: "three"} ]
    , { type: "fixed", input: "gogogo"}
    ]
  )
})
*/

test('Parsing should handle a path with fixed part and variable optional part', function (t) {
  t.plan(2)

  var parts = [
        [
          utils.rootPart()
        , utils.fixedPart('wibble')
        , [utils.varPart('foo')]
        ]
      , [
          utils.rootPart()
        , utils.fixedPart('wibble')
        , [
            utils.varPart('foo')
          , utils.varPart('bar')
          ]
        ]
      ]

  t.deepEqual(rhumb._parse('/wibble(/{foo})'), parts[0]
    , 'returns a root part, a fixed part and an optional variable part when being parsed')

  t.deepEqual(rhumb._parse('/wibble(/{foo}/{bar})'), parts[1]
    , 'returns a root part, a fixed part and an optional fixed part when being parsed')
})

test('Parsing should handle a path with fixed part and single partial optional part', function (t) {
  t.plan(2)

  var parts = [
        [
          utils.rootPart()
        , utils.fixedPart('wibble')
        , [utils.partialPart(['foo', 'bar'], '{var}-{var}', /([\w-%]+)-([\w-%]+)/)]
        ]
      , [
          utils.rootPart()
        , utils.fixedPart('wibble')
        , [
            utils.partialPart(['foo'], '{var}-part', /([\w-%]+)-part/)
          , utils.partialPart(['bar'], 'part-{var}', /part-([\w-%]+)/)
          ]
        ]
      ]

  t.deepEqual(rhumb._parse('/wibble(/{foo}-{bar})'), parts[0]
    , 'returns a root part, a fixed part and an optional partial part when being parsed')

  t.deepEqual(rhumb._parse('/wibble(/{foo}-part/part-{bar})'), parts[1]
    , 'returns a root part, a fixed part and an optional partial part when being parsed')
})

test('Parsing should handle a path with trailing slash in fixed path and leading slash in the optional path', function (t) {
  t.plan(1)
  var parts = [
        utils.rootPart()
      , utils.fixedPart('wibble')
      , [utils.fixedPart('foo')]
      ]

  t.deepEqual(rhumb._parse('/wibble/(/foo)'), parts
    , 'returns a root part, a fixed part and one optional part when being parsed')
})

test('Optional paths should handle a path with empty parts', function (t) {
  t.plan(3)
  var parts = [
        [
          utils.rootPart()
        , utils.fixedPart('wibble')
        , [utils.fixedPart('bar'), utils.fixedPart('bing')]
        ]
      , [
          utils.rootPart()
        , utils.fixedPart('wibble')
        , [utils.fixedPart('foo'), utils.fixedPart('bing')]
        ]
      , [
          utils.rootPart()
        , utils.fixedPart('wibble')
        , [utils.fixedPart('foo'), utils.fixedPart('bar')]
        ]
      ]

  t.deepEqual(rhumb._parse('/wibble(//bar/bing)'), parts[0]
    , 'ignores empty part at the start of the path when being parsed')

  t.deepEqual(rhumb._parse('/wibble(/foo//bing)'), parts[1]
    , 'ignores empty part in the middle of the path when being parsed')

  t.deepEqual(rhumb._parse('/wibble(/foo/bar//)'), parts[2]
    , 'ignores empty part at the end of the path when being parsed')
})

test('Parsing should handle a path with empty optional part', function (t) {
  t.plan(1)

  var parts = [
        utils.rootPart()
      , utils.fixedPart('wibble')
      ]

  t.deepEqual(rhumb._parse('/wibble()'), parts
    , 'ignores empty optional path when being parsed')
})
