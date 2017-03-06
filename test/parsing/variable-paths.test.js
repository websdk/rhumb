var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test("Parsing should find single variable part", function(t) {
  t.plan(1)

  var parts = [
        utils.rootPart()
      , utils.varPart('foo')
      ]

  t.deepEqual(rhumb._parse('/{foo}'), parts
    , 'returns a root part and variable part when being parsed')
})

test("Parsing should find multiple variable parts", function(t) {
  t.plan(1)

  var parts = [
        utils.rootPart()
      , utils.fixedPart('wibble')
      , utils.fixedPart('wobble')
      ]

  t.deepEqual(rhumb._parse('/wibble/wobble'), parts
    , 'returns a root part and two fixed parts when being parsed')
})

test("Parsing should find variable and fixed parts", function(t) {
  t.plan(1)

  var parts = [
        utils.rootPart()
      , utils.varPart('wibble')
      , utils.fixedPart('bar')
      , utils.varPart('wobble')
      ]

  t.deepEqual(rhumb._parse('/{wibble}/bar/{wobble}'), parts
    , 'returns a root part, two fixed parts and a variable part when being parsed')
})
