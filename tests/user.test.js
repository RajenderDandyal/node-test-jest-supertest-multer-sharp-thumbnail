const app = require('../src/app');
const _ = require('lodash');
const request = require('supertest');
const User = require('../src/models/user');
const user1 = {
    name: 'Rajender',
    email: 'raj@gmail.com',
    password: '123rajender'
};

const user2 = {
    name: 'Rajender',
    email: 'raj123@gmail.com',
    password: '1231234w'
}


describe('post/users', () => {
    beforeEach(async () => {
        //await User.deleteMany({});
        await User.remove({});
    });
    it('should register a new user', async function () {
        await request(app).post('/users').send(user2).expect(201)
    });
});

describe('post/users/login', () => {
    beforeEach(async () => {
        //await User.deleteMany({});
        await User.remove({});
        await new User(user1).save()
    });
    it('should log in a user', async function () {
        await request(app).post('/users/login')
            .send({email: user1.email, password: user1.password})
            .expect(200)
            .then(response=>{
                if (_.isEmpty(response.body.user) || _.isEmpty(response.body.token)) throw new Error('login didnt worked')
            })
    });
});

