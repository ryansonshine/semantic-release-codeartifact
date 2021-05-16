import { removeTrailingSlash } from '../../src/util/string';

describe('string', () => {
  describe('removeTrailingSlash', () => {
    it('should remove trailing slashes with expected inputs', () => {
      expect(removeTrailingSlash('https://google.com/')).toEqual(
        'https://google.com'
      );

      expect(removeTrailingSlash(0)).toEqual('');

      expect(
        removeTrailingSlash('http://local/url/with/trailing/slash/')
      ).toEqual('http://local/url/with/trailing/slash');
    });
  });
});
