/** EXTERNAL DEPENDENCIES */
const express = require("express");

/** INIT */
const app = express();
const port = 2000;


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
})


 app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });