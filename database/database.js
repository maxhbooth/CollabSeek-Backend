const pg = require('pg');
var password = process.env.POSTGRESQL_PASSWORD;
var user = process.env.POSTGRESQL_USER;
var database = process.env.POSTGRESQL_DATABASE;
// want POSTGRESQL_VERSION=9.5 