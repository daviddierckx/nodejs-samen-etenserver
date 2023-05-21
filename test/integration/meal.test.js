process.env['DB_DATABASE'] = process.env.DB_DATABASE || 'shareameal-testdb';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const dbconnection = require('../../app/dao/database');
const mysql = require('mysql');
const config = require('../../app/config');
const { loginToken } = require('./user.test');

const jwt = require('jsonwebtoken');
require('tracer').setLevel('error');
const { log } = require('console');

chai.should();
chai.use(chaiHttp);
const { loginUser } = require('../loginUtils');
let login

describe('Meal API', function () {


});
