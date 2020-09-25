const express = require('express');
const github = require('octonode');

const app = express();
const port = 5000;

/**
 * Map through array of repositories, return name, url and language. If name parameter present, filtering names by it.
 * @param {string} name
 * @returns {object[]} returns
 */
const getFilteredRepositories = (repositories, name) => {
  if (!repositories) {
    throw new Error('No repositories');
  }
  return repositories
    .map((repo) => ({
      name: repo.name,
      url: repo.url,
      langauge: repo.language,
    }))
    .filter((repo) => (name ? repo.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()) : true));
};

/**
 * Method returning list of respositories from the owner of token
 * Throws an error if token is invalid or not present
 * @param {string} token
 * @param {string} name
 * @returns {Promise<object>} give us name, url and langauge of the repositories
 */
const getRepositoriesOfUser = async (token, name) => {
  return new Promise((resolve, reject) => {
    try {
      if (!token) {
        const tokenError = new Error('Token not present');
        tokenError.status = 401;
        throw tokenError;
      }
      const client = github.client(token);
      // GHME REFERS NOW TO THE OWNER OF THE TOKEN
      const ghme = client.me();
      // FETCH ALL THE REPOSITORIES
      ghme.repos((err, data, headers) => {
        if (err) {
          return reject(err);
        }
        const repositories = getFilteredRepositories(data, name);
        resolve({ repositories });
      });
    } catch (error) {
      reject(error);
    }
  });
};

app.get('/api/repositories', async (req, res, next) => {
  try {
    // Extract token from Headers, if no token present, throw error
    const token = req.headers.token;
    if (!token) {
      const tokenError = new Error('No token found');
      tokenError.status = 401;
      return next(tokenError);
    }
    // EXTRACT QUERY PARAM
    const name = req.query.name;
    // GET ALL REPOSITORIES
    const repositories = await getRepositoriesOfUser(token, name);
    // RETURN REPOSITORIES TO THE USER
    res.json(repositories);
  } catch (error) {
    next(error);
  }
});

// HANDLING ALL ERRORS
app.use((error, req, res, next) => {
  res.status(error.status || 500).send(error);
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});


module.exports = { getRepositoriesOfUser, getFilteredRepositories };