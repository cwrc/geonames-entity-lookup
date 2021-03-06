# geonames-entity-lookup

![Picture](http://cwrc.ca/logos/CWRC_logos_2016_versions/CWRCLogo-Horz-FullColour.png)

[![Travis](https://img.shields.io/travis/cwrc/geonames-entity-lookup.svg)](https://travis-ci.org/cwrc/geonames-entity-lookup)
[![Codecov](https://img.shields.io/codecov/c/github/cwrc/geonames-entity-lookup.svg)](https://codecov.io/gh/cwrc/geonames-entity-lookup)
[![version](https://img.shields.io/npm/v/geonames-entity-lookup.svg)](http://npm.im/geonames-entity-lookup)
[![downloads](https://img.shields.io/npm/dm/geonames-entity-lookup.svg)](http://npm-stat.com/charts.html?package=geonames-entity-lookup&from=2015-08-01)
[![GPL-3.0](https://img.shields.io/npm/l/geonames-entity-lookup.svg)](http://opensource.org/licenses/GPL-3.0)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

1. [Overview](#overview)
1. [Installation](#installation)
1. [Use](#use)
1. [API](#api)
1. [Development](#development)

## Overview

Finds places in geonames. Meant to be used with [cwrc-public-entity-dialogs](https://github.com/cwrc-public-entity-dialogs) where it runs in the browser.

Although it will not work in node.js as-is, it does use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for http requests, and so could likely therefore use a browser/node.js compatible fetch implementation like: [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch).

For queries, we use the geonames search service: `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(queryString)}&maxRows=10`

To show full page preview of individual places we in effect call: `https://geonames.org/[placeId]`.

## Installation

`npm i geonames-entity-lookup`

## Use

`import geonamesLookup from 'geonames-entity-lookup';`

### username

GeoNames is a free service but it requires a user account.
This should be provided through CWRC-GitWriter configuration (see more here: [https://github.com/cwrc/CWRC-GitWriter](https://github.com/cwrc/CWRC-GitWriter)).

If you want to use it as a standalone, you can provide the user name adding the following line to `index.js`: `credentials.username = '${YOUR_USERNAME}'`

You can create a free user account here account: [https://www.geonames.org/login](https://www.geonames.org/login)

## API

### findPlace(query)

where the 'query' argument is an object:  

```js
{
    entity:  "The name of the place the user wants to find.",
    options: "TBD"
}
```

findPlace returns a promise that resolve to an object like the following:

```json
{
   "description": "Paris is the capital and largest city of France. It is situated on the river Seine, in northern France, at the heart of the Île-de-Franc…",
   "id": "https://geonames.org/4345345",
   "name": "Paris",
   "nameType": "place",
   "originalQueryString": "paris",
   "repository": "geonames",
   "uri": "https://geonames.org/4345345",
   "uriForDisplay": "",
   "externalURI": "https://geonames.org/4345345"
}
```

There is another method mainly made available to facilitate testing (to make it easier to mock calls to the geonames service):

### getPlaceLookupURI(query)

where the 'query' argument is the place name to find and the methods return the geonames URL that in turn returns results for the query.

## Development

[CWRC-Writer-Dev-Docs](https://github.com/cwrc/CWRC-Writer-Dev-Docs) describes general development practices for CWRC-Writer GitHub repositories, including this one.

<!-- ### Testing

The code in this repository is intended to run in the browser, and so we use [browser-run](https://github.com/juliangruber/browser-run) to run [browserified](http://browserify.org) [tape](https://github.com/substack/tape) tests directly in the browser.

We [decorate](https://en.wikipedia.org/wiki/Decorator_pattern) [tape](https://github.com/substack/tape) with [tape-promise](https://github.com/jprichardson/tape-promise) to allow testing with promises and async methods. -->

### Mocking

We use [fetch-mock](https://github.com/wheresrhys/fetch-mock) to mock http calls (which we make using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) rather than XMLHttpRequest).

<!-- We use [sinon](http://sinonjs.org) [fake timers](http://sinonjs.org/releases/v4.0.1/fake-timers/) to test our timeouts, without having to wait for the timeouts. -->

<!-- ### Code Coverage

We generate code coverage by instrumenting our code with [istanbul](https://github.com/gotwarlost/istanbul) before [browser-run](https://github.com/juliangruber/browser-run) runs the tests, then extract the coverage (which [istanbul](https://github.com/gotwarlost/istanbul) writes to the global object, i.e., the window in the browser), format it with [istanbul](https://github.com/gotwarlost/istanbul), and finally report (Travis actually does this for us) to [codecov.io](codecov.io) -->

<!-- ### Transpilation

We use [babelify](https://github.com/babel/babelify) and [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul) to compile our code, tests, and code coverage with [babel](https://github.com/babel/babel) -->

### Continuous Integration

We use [Travis](https://travis-ci.org).

### Release

We follow [SemVer](http://semver.org), which [Semantic Release](https://github.com/semantic-release/semantic-release) makes easy. Semantic Release also writes our commit messages, sets the version number, publishes to NPM, and finally generates a changelog and a release (including a git tag) on GitHub.
