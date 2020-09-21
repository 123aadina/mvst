/** EXTERNAL DEPENDENCIES */
const express = require("express");

/** INIT */
const api = express();


/** START SERVER*/
const server = api.listen(3000, () => console.log("server is running"));