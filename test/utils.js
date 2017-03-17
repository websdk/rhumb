function emptySegment() {
  return { type: 'empty' }
}

function fixedSegment(identifier) {
  return { type: 'fixed', identifier: identifier }
}

function partialSegment(identifier, vars, matchFunction) {
  return { type: 'partial', identifier: identifier, vars: vars, matchFunction: matchFunction }
}

function varSegment(identifier) {
  return { type: 'var', identifier: identifier }
}

function optionalPart(segments, leadingSlash, trailingSlash) {
  return {
    segments: segments
  , leadingSlash: !!leadingSlash
  , trailingSlash: !!trailingSlash
  }
}

module.exports = {
  emptySegment: emptySegment
, fixedSegment: fixedSegment
, optionalPart: optionalPart
, partialSegment: partialSegment
, varSegment: varSegment
}
