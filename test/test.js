'use strict';

import fetchMock from 'fetch-mock';
import geonames from '../src/index.js';

const emptyResultFixture = JSON.stringify(require('./httpResponseMocks/noResults.json'));
const resultsFixture = JSON.stringify(require('./httpResponseMocks/results.json'));
const noDescResultsFixture = JSON.stringify(
  require('./httpResponseMocks/resultsWitoutDescription.json')
);

const geonamesUsername = 'testUser';
const queryString = 'smith';
const queryStringWithNoResults = 'ldfjk';
const queryStringForTimeout = 'chartrand';
const queryStringForError = 'cuff';
const queryStringForMissingDescriptionInResult = 'blash';
const expectedResultLength = 10;

jest.useFakeTimers();

// setup server mocks

geonames.credentials.username = geonamesUsername;

const uriBuilderFn = geonames.getPlaceLookupURI;

fetchMock.get(uriBuilderFn(queryString), resultsFixture);
fetchMock.get(uriBuilderFn(queryStringWithNoResults), emptyResultFixture);
fetchMock.get(uriBuilderFn(queryStringForTimeout), () => {
  setTimeout(Promise.reject, 810);
});
fetchMock.get(uriBuilderFn(queryStringForError), 500);
fetchMock.get(uriBuilderFn(queryStringForMissingDescriptionInResult), noDescResultsFixture);

// from https://stackoverflow.com/a/35047888
const doObjectsHaveSameKeys = (...objects) => {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
};

test('lookup username', () => {
  expect.assertions(1);
  expect(geonames.credentials.username).toBeTruthy();
});

test('lookup builder', () => {
  expect.assertions(1);
  expect(geonames.getPlaceLookupURI(queryString).includes(queryString)).toBe(true);
});

test('findPlace', async () => {
  expect.assertions(22);
  const results = await geonames.findPlace(queryString);
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBeLessThanOrEqual(expectedResultLength);

  results.forEach((singleResult) => {
    expect(
      doObjectsHaveSameKeys(singleResult, {
        nameType: '',
        id: '',
        uri: '',
        uriForDisplay: '',
        externalLink: '',
        name: '',
        repository: '',
        originalQueryString: '',
        description: '',
      })
    ).toBe(true);
    expect(singleResult.originalQueryString).toBe(queryString);
  });
});

test('findPlace: result with no Description', async () => {
  // with a result from geonames with no Description
  expect.assertions(3);
  const results = await geonames.findPlace(queryStringForMissingDescriptionInResult);
  expect(Array.isArray(results)).toBe(true);
  expect(
    doObjectsHaveSameKeys(results[0], {
      nameType: '',
      id: '',
      uri: '',
      uriForDisplay: '',
      externalLink: '',
      name: '',
      repository: '',
      originalQueryString: '',
      description: '',
    })
  ).toBe(true);
  expect(results[0].description).toBe('No description available');
});

test('findPlace: no results', async () => {
  // with no results
  expect.assertions(2);
  const results = await geonames.findPlace(queryStringWithNoResults);
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(0);
});

test('findPlace: server error', async () => {
  // with a server error
  expect.assertions(2);
  let shouldBeNullResult = false;
  shouldBeNullResult = await geonames.findPlace(queryStringForError).catch(() => {
    // an http error should reject the promise
    expect(true).toBe(true);
    return false;
  });
  // a falsey result should be returned
  expect(shouldBeNullResult).toBeFalsy();
});

test('findPlace: times out', async () => {
  // when query times out
  expect.assertions(1);
  await geonames.findPlace(queryStringForTimeout).catch(() => {
    // the promise should be rejected
    expect(true).toBe(true);
  });
});
