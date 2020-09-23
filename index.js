/** EXTERNAL DEPENDENCIES */
const express = require("express");

/** INIT */
const app = express();
const port = 5000;


app.get('/api/repositories' , async (req, res, next) => {
    try {
        // EXTRACT TOKEN FROM HEADERS
        const token = req.headers.token;
        // CHECK IF TOKEN IS PRESENT
        if(!token) {
            // IF NOT THROW AN ERROR
            const tokenError = new Error('No token found');
            tokenError.status = 401;
            return next(tokenError);
        }
         // EXTRACT QUERY PARAM
        const name = req.query.name
        // GET ALL REPOSITORIES
        const repositories = await getRepositoriesOfUser(name, token);
        // RETURN REPOSITORIES TO THE USER
        res.json(repositories);
    } catch (error) {
        next(error)
    }
});
const getRepositoriesOfUser = (token, name) => 
    new Promise((resolve, reject) => {
          // SET UP GITHUB CLIENT
        const client = github.client(token);
          // GHME REFERS NOW TO THE OWNER OF THE TOKEN
        const ghme = client.me();
        // HERE FETCH ALL THE REPOSITORIES
        ghme.repos((err, data, headers) => {
            if(err) {
                return reject(err);
            }
            // I MAP THROUG REPOSITORIES AND FILTER IN CASE THERE IS PARAMETER NAME
            const repositories = data.map((repo) => ({
                name: repo.name,
                url: repo.url,
                langauge: repo.langauge,
            }))
            .filter((repo) => 
            name ? repo.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()) : true
            );
            resolve({ repositories});
        });
    });




 app.listen(port, () => {
     console.log(`App is listening on port ${port}`)
 });