function findIn(path, tree) {
  var parsedPath = parse(path)

  var find = function (part, node, params) {
    var segment = part.segments.shift()

    if (!segment) {
      return node.leaf ? { fn: node.leaf, params: params } : false
    }

    switch (segment.type) {
      case 'fixed':
        break
      case 'var':
        throw new InvalidPathException('Must not contain a variable segment', path)
      case 'partial':
        throw new InvalidPathException('Must not contain a partial variable segment', path)
      case 'empty':
        throw new InvalidPathException('Must not contain an empty segment', path)
      default:
        throw new InvalidPathException('Must not contain an optional path', path)
    }

    if (node.fixed && segment.identifier in node.fixed) {
      return find(part, node.fixed[segment.identifier], params)
    }

    if (node.partial) {
      var tests = node.partial.tests
        , found = tests.map(function (partial) {
          var params = partial.matchFunction(segment.identifier)
            return params ? { partial: partial, params: params } : null
          }).filter(falsy)
        , matchingPartial = found.length > 0 ? found[0] : null

      if (matchingPartial) {
        for (var key in matchingPartial.params) {
          params[key] = matchingPartial.params[key]
        }
        return find(part, matchingPartial.partial, params)
      }
    }

    if (node.variable) {
      params[node.variable.identifier] = segment.identifier
      return find(part, node.variable, params)
    }
    return false
  }

  return find(parsedPath, tree, parsedPath.queryParams)
}

function create() {
  var router = {}
    , tree = {}

  function updateTree(part, node, route, fn) {
    var segment = part.segments.shift()
      , more = !!part.segments.length
      , peek

    if (!segment) {
      if (node.leaf) {
        throw new Error('Ambiguity')
      }

      node.leaf = fn
      return
    }

    if (Array.isArray(segment.segments)) {
      if (node.leaf) {
        throw new Error('Ambiguity')
      }
      node.leaf = fn
      updateTree(segment, node, route, fn)
      return
    }

    switch (segment.type) {
      case 'fixed':
        if (!node.fixed) {
          node.fixed = {}
        }
        if (!node.fixed[segment.identifier]) {
          node.fixed[segment.identifier] = {}
        }
        peek = node.fixed[segment.identifier]

        if (peek.leaf && !more) {
          throw new Error('Ambiguity')
        }
        break
      case 'var':
        if (node.variable) {
          if (node.variable.identifier === segment.identifier) {
            peek = node.variable
          } else {
            throw new Error('Ambiguity')
          }
        } else {
          node.variable = { identifier: segment.identifier }
          peek = node.variable
        }
        break
      case 'partial':
        if (node.partial) {
          if (node.partial.identifiers[segment.identifier]) {
            throw new Error('Ambiguity')
          }
        } else {
          node.partial = { identifiers: {}, tests: [] }
        }

        peek = { matchFunction: segment.matchFunction }

        node.partial.identifiers[segment.identifier] = peek
        node.partial.tests.push(peek)
        break
      case 'empty':
        throw new InvalidRouteException('Must not contain an empty segment', route)
    }
    if (!more) {
      peek.leaf = fn
    } else {
      updateTree(part, peek, route, fn)
    }
  }

  router.add = function (route, callback) {
    var parsedRoute = parse(route)
    if (Object.keys(parsedRoute.queryParams).length > 0) {
      throw new InvalidRouteException('Must not contain a query string', route)
    }
    updateTree(parsedRoute, tree, route, callback)
  }

  router.match = function(path) {
    var match = findIn(path, tree)

    if (match) {
      return match.fn.apply(match.fn, [match.params])
    }
  }
  return router
}

function InvalidRouteException(message, route) {
  this.message = message
  this.name = 'InvalidRouteException'
  this.route = route

  this.toString = function () {
    return 'Invalid route: ' + message
  }
}

function InvalidPathException(message, path) {
  this.message = message
  this.name = 'InvalidPathException'
  this.path = path

  this.toString = function () {
    return 'Invalid path: ' + message
  }
}

function falsy(d){
  return !!d
}

function parseQueryString(s) {
  if(!s) return {}
  return s.split("&").filter(falsy).reduce(function(qs, kv) {
    var pair = kv.split('=').filter(falsy)
    qs[pair[0]] = pair[1]
    return qs
  }, {})
}

function asEmptySegment(pathSegment) {
  return pathSegment === '' ? { type: 'empty' } : null
}

function asFixedSegment(pathSegment) {
  return { type: 'fixed', identifier: pathSegment }
}

function asPartialSegment(pathSegment) {
  var partialRegex = /([\w'-]+)?{([\w-]+)}([\w'-]+)?/
    , match = pathSegment.match(partialRegex)
    , vars = []
    , ptn = ''
    , len = pathSegment.length
    , index = 0
    , identifier = pathSegment.replace(/{([\w-]+)}/g, extractAndTransformVariableName)

  if (!match) {
    return null
  }

  while(index < len && match) {
    index += match[0].length

    if (match[1]) {
      ptn += match[1]
    }

    ptn += '([\\w-]+)'

    if (match[3]) {
      ptn += match[3]
    }

    match = pathSegment.substr(index).match(partialRegex)
  }

  var matchRegex = new RegExp(ptn)

  return {
    type: 'partial'
  , identifier: identifier
  , matchFunction: matchFunction
  , vars: vars
  }

  function extractAndTransformVariableName(matchedPattern, variableName) {
    vars.push(variableName)
    return '{var}'
  }

  function matchFunction(segment) {
    var segmentMatches = segment.match(matchRegex)

    return segmentMatches ? vars.reduce(function (params, variable, index) {
      params[variable] = segmentMatches[index + 1]
      return params
    }, {}) : null
  }
}

function asVarSegment(pathSegment) {
  var match = pathSegment.match(/^{(\w+)}$/)

  return match ? { type: 'var', identifier: match[1] } : null
}

function parsePtn(ptn) {
  return ptn.split('/')
    .reduce(function(parsedRecord, pathSegment, index, allSegments) {
      if (pathSegment === '' && index === 0) {
        parsedRecord.leadingSlash = allSegments.length > 1
      } else if (pathSegment === '' && index === allSegments.length - 1) {
        parsedRecord.trailingSlash = true
      } else {
        var newSegment = asEmptySegment(pathSegment)
              || asVarSegment(pathSegment)
              || asPartialSegment(pathSegment)
              || asFixedSegment(pathSegment)
        parsedRecord.segments.push(newSegment)
      }
      return parsedRecord
    }, { leadingSlash: false, segments: [], trailingSlash: false })
}

function parseOptional(ptn) {
  var out =  ''

  var i = 0
    , len = ptn.length
    , isOptionalSegment = false

  while (!isOptionalSegment && i < len) {
    var curr = ptn.charAt(i)
    switch (curr) {
      case ')':
      case '(':
        isOptionalSegment = true
        break
      default:
        out += curr
        break
    }
    i++
  }

  var parsedOutput = parsePtn(out)
  if (isOptionalSegment) {
    var optionalSegment = parseOptional(ptn.substr(i))
    if (optionalSegment.segments.length > 0) {
      parsedOutput.segments.push(optionalSegment)
      parsedOutput.trailingSlash = optionalSegment.trailingSlash
    }
  }

  return parsedOutput
}

function parse(route) {
  var split = route.split('?')
    , parsedPath = split[0].indexOf('(/') > -1
        ? parseOptional(split[0])
        : parsePtn(split[0])

  parsedPath.queryParams = parseQueryString(split[1])
  return parsedPath
}

var rhumb = create()
rhumb.create = create
rhumb._parse = parse
rhumb._findInTree = findIn

module.exports = rhumb
