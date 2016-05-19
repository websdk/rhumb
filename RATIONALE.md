# Why Rhumb?

> In navigation, a rhumb line, rhumb, or loxodrome is an arc crossing all meridians of longitude at the same angle, i.e. a path with constant bearing as measured relative to true or magnetic north.

Essentially, a rhumb line is a convenient – albeit not the most efficient – way of navigating, since it means not having to constantly change bearing in order to stay on course.

The significance of the word aside, it's a great name for this library. Why? It'll become evident as we discuss its responsibilities.

Rhumb is essentially a highly specilized pattern matcher, matching URIs with a target function. The same functionality could be implemented using a generic pattern matching module, however it's very likely that this would be slower and more inconvenient.

In terms of requirements, this is how one might sum up What Rhumb does:

> Given a URI – where the constituent parts may be fixed or variable – Rhumb will unambiguously and with negligable overhead find a matching function, then apply it with whatever parameters might have been extracted from the URI.

That's it, that's all there is. Of course, there are nuances to this, but that's Rhumb's mission statement.

To accomplish this, Rhumb needs to:

- have a robust and flexible front-end for describing patterns and matching functions
- detect ambiguities immediately as patterns are added
- match URIs in O(1) time, possibly at the expense of slower registration
- extract, based on the pattern, relevant information and provide registered functions with this information

Coming back to the name, Rhumb, we can now see why it's fitting. Given instructions – a URI – Rhumb will swiftly navigate to the correct function and apply it. It doesn't care what the function does, it doesn't care if the function is fast or slow, asynchronous or not. It's clever enough to understand patterns in a way where it can detect ambiguities at the time of adding one, and it's fast enough to be used in real world routing situations.

Rhumb keeps you on course.