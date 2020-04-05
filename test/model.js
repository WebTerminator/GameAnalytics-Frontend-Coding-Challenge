var chai = require('chai');
var assert = chai.assert;

import Model from '../model.js'

describe('Model', function () {
  const model = new Model();
  const API_KEY = 'APY_KEY';

  describe('getUrl()', () => {
    it('should return the correct url when getUrl is called with an empty parameter', function () {
      const EXPECTED_URL = `https://api.themoviedb.org/3/movie/top_rated?${API_KEY}&language=en-US&page=1`;

      assert.equal(model.getUrl(''), EXPECTED_URL);
    });

    it('should return the correct url when getUrl is called with a search text value', function () {
      const searchText = 'JFK';
      const EXPECTED_URL = `https://api.themoviedb.org/3/search/movie?${API_KEY}&language=en-US&page=1&include_adult=false&query=${searchText}`;

      assert.equal(model.getUrl(searchText), EXPECTED_URL);
    });
  });

  describe('searchText', () => {
    it('should update the searchText when updateSearchText is called', function () {
      const e = {
        target: {
          value: 'JFK'
        }
      };

      const EXPECTED_VALUE = 'JFK';
      model.updateSearchText(e);

      assert.equal(model.searchText, EXPECTED_VALUE);
    });
  });
});
