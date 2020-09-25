const { getRepositoriesOfUser } = require('../index.js');
const github = require('octonode');

describe('Sample test of method to fetch repositories', () => {
  test('Token not present, should return error with status 401', () => {
    return getRepositoriesOfUser().catch((e) => {
      expect(e.status).toBe(401);
    });
  });

  test('Token not present, should return error with message "Token not present"', () => {
    return expect(getRepositoriesOfUser()).rejects.toThrow('Token not present');
  });

  test('Token not correct, should throw an error with "Bad credentials" message', () => {
    return expect(getRepositoriesOfUser('ddsadsadsa')).rejects.toThrow('Bad credentials');
  });

  test('Token correct, should return array of respositories, with length bigger than 0', () => {
    return expect(
      getRepositoriesOfUser('ad79ea7c5123597b0e398ec1e092a6f96a1f2a22').then(
        (d) => d.repositories.length
      )
    ).resolves.toBeGreaterThan(0);
  });

  test('Token correct, returned array should have 1 elements', () => {
    return expect(
      getRepositoriesOfUser('ad79ea7c5123597b0e398ec1e092a6f96a1f2a22', 'mvst').then(
        (d) => d.repositories.length
      )
    ).resolves.toBe(1);
  });
});