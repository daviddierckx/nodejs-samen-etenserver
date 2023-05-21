const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const routes = require('./app/router/user.routes')
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
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
