const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const routes = require('./app/router/routes')
const logger = require('tracer').console()
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const dotenv = require('dotenv')

app.get('/', (req, res) => {
    res.send("Sharemeal API");
});

app.use('/api', routes);


app.listen(port, () => {
    logger.log(`Avans app listening at http://localhost:${port}`);
});

module.exports = app;
