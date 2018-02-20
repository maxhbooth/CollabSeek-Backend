var express = require('express'),
app = express(),
port = process.env.PORT || 8080;
const { Client } = require('pg');

var dbUser = process.env.POSTGRESQL_USER;
var dbPass = process.env.POSTGRESQL_PASSWORD;
var dbName = process.env.POSTGRESQL_NAME;
var dbHost = "";
var dbPort = "";
var testFlag = process.env.TEST_FLAG
if (testFlag == "test"){
    //test
    dbHost = process.env.POSTGRESQLTEST_SERVICE_HOST;
    dbPort = process.env.POSTGRESQLTEST_SERVICE_PORT;    
    
} else {
    //prod
    dbHost = process.env.POSTGRESQL_SERVICE_HOST;
    dbPort = process.env.POSTGRESQL_SERVICE_PORT;
}
const client = new Client({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPass,
    port: dbPort
})
client.connect();

var routes = require('./api/routes/userRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

module.exports = app;
module.exports = client;