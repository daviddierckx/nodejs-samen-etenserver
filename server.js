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

app.use(express.json())
app.use('/api', routes);


app.get('/api/info', (req, res) => {
    logger.log("Get request op /api/info")

    const info = {
        Studentnaam: 'David Dierckx',
        Studentnummer: '2179946',
        Beschrijving: 'Avans hogeschool',
        SonarqubeURL: 'https://sonarqube.avans-informatica-breda.nl/dashboard?id=nodejs-sameneten'
    }
    res.status(200).json(info)
})
// Catch-all route
app.all("*", (req, res, next) => {
    console.log("Catch-all endpoint aangeroepen");
    next({ message: "Endpoint '" + req.url + "' does not exist", errCode: 404 });
});
app.use((error, req, res, next) => {
    console.log("Errorhandler called! ", error);
    res.status(error.errCode).json({
        error: "Some error occurred",
        message: error.message,
    });
});
app.listen(port, () => {
    logger.log(`Avans app listening at http://localhost:${port}`);
});

module.exports = app;
