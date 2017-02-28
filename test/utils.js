var rhumb = require('../src/rhumb')

function performMatch(route, path, callback) {
  var router = rhumb.create()

  router.add(route, callback)

  router.match(path)
}

function rootPart() {
  return { type: 'fixed', input: '/' }
}

function fixedPart(name) {
  return { type: 'fixed', input: name }
}

function varPart(name) {
  return { type: 'var', input: name }
}

function partialPart(vars, pattern, regex) {
  return { type: 'partial', input: regex, name: pattern, vars: vars }
}

module.exports = {
  fixedPart: fixedPart
, partialPart: partialPart
, performMatch: performMatch
, rootPart: rootPart
, varPart: varPart
}
