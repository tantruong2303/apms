require("dotenv").config();
const express = require("express");
const { logger } = require("./app/logger");

const app = express();

require("./app/db")();
require("./app/router")(app);
require("./app/prod")(app);
require("./service/passport");

const port = process.env.PORT || 3000;
app.listen(port, async () => {
        logger.info(`Current mode: ${process.env.NODE_ENV}`);
        logger.info(`Listening on port ${port}`);
});
