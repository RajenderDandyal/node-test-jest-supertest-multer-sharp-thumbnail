const app = require('../src/app');
const request = require('supertest');

const user = {
    name:'Rajender',
    email:'raj@gmail.com',
    password:'123raj'
};

const userIncorrect = {
    name:'Rajender',
    email:'rajgmail.com',
    password:'123'
}

it('should register a new user', function () {
    request(app).post('/users').send(userIncorrect).expect(201)
});