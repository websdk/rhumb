var test  = require('tape')
  , rhumb = require('../../src/rhumb')
  , utils = require('../utils')

test('Parsing should find segments for a path with variable segments', function (t) {
  t.plan(4)

  t.deepEqual(rhumb._parse('/{foo}').segments, [utils.varSegment('foo')], 'one variable segment found')
  t.deepEqual(rhumb._parse('/wibble/{foo}').segments, [utils.fixedSegment('wibble'), utils.varSegment('foo')], 'one fixed and one variable segment found')
  t.deepEqual(rhumb._parse('/{foo}/wobble').segments, [utils.varSegment('foo'), utils.fixedSegment('wobble')], 'one fixed and one variable segment found')
  t.deepEqual(rhumb._parse('/{foo}/{bar}').segments, [utils.varSegment('foo'), utils.varSegment('bar')], 'two variable segments found')
})
