const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const routes = require('./app/router/routes')
const logger = require('tracer').console()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', routes);
app.listen(port, () => {
    logger.log(`Avans app listening at http://localhost:${port}`);
});

module.exports = app;
