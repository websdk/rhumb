var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test('Parsing should always infer root', function(t) {
  t.plan(2)

  t.deepEqual(rhumb._parse(''), [utils.rootPart()]
    , 'returns a root part when being parsed')
  t.deepEqual(rhumb._parse('/'), [utils.rootPart()]
    , 'returns a root part when being parsed')
})

test("Parsing should find one fixed part", function(t) {
  t.plan(2)

  var parts = [
        utils.rootPart()
      , utils.fixedPart('foo')
     ]

  t.deepEqual(rhumb._parse('/foo'), parts
    , 'returns a root part and fixed part when being parsed')

  t.deepEqual(rhumb._parse('/foo/'), parts
    , 'returns a root part and fixed part when being parsed')
})

test("Parsing should find multiple fixed parts", function(t) {
  t.plan(2)

  var parts = [
        utils.rootPart()
      , utils.fixedPart('foo')
      , utils.fixedPart('bar')
      , utils.fixedPart('bing')
     ]

  t.deepEqual(rhumb._parse('/foo/bar/bing'), parts
    , 'returns a root part and three fixed parts when being parsed')

  t.deepEqual(rhumb._parse('/foo/bar/bing/'), parts
    , 'returns a root part and three fixed parts when being parsed')
})

test('Parsing should handle a path with no leading slash', function(t) {
  t.plan(4)

  var singleParts = [
        utils.rootPart()
      , utils.fixedPart('foo')
      ]
    , multipleParts = [
        utils.rootPart()
      , utils.fixedPart('foo')
      , utils.fixedPart('bar')
      , utils.fixedPart('bing')
      ]

  t.deepEqual(rhumb._parse('/foo'), singleParts
    , 'returns a root part and fixed part when being parsed')

  t.deepEqual(rhumb._parse('/foo/bar/bing'), multipleParts
    , 'returns a root part and three fixed parts when being parsed')

  t.deepEqual(rhumb._parse('/foo/'), singleParts
    , 'returns a root part and fixed part when being parsed')

  t.deepEqual(rhumb._parse('/foo/bar/bing/'), multipleParts
    , 'returns a root part and three fixed parts when being parsed')
})

test('Parsing should handle a path with empty parts', function(t) {
  t.plan(4)

  var emptyStartParts = [
        utils.rootPart()
      , utils.fixedPart('bar')
      , utils.fixedPart('bing')
      ]
    , emptyMiddleParts = [
        utils.rootPart()
      , utils.fixedPart('foo')
      , utils.fixedPart('bing')
      ]
    , emptyEndParts = [
        utils.rootPart()
      , utils.fixedPart('foo')
      , utils.fixedPart('bar')
      ]

  t.deepEqual(rhumb._parse('//'), [utils.rootPart()]
    , 'returns a root part when being parsed')

  t.deepEqual(rhumb._parse('//bar/bing'), emptyStartParts
    , 'returns a root part and two fixed parts when being parsed')

  t.deepEqual(rhumb._parse('/foo//bing'), emptyMiddleParts
    , 'returns a root part and two fixed parts when being parsed')

  t.deepEqual(rhumb._parse('/foo/bar//'), emptyEndParts
    , 'returns a root part and two fixed parts when being parsed')
})
