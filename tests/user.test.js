const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash');
const request = require('supertest');
const User = require('../src/models/user');

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
    _id: user1Id,
    name: 'Rajender',
    email: 'raj@gmail.com',
    password: '123rajender',
    tokens:[{token:jwt.sign({_id:user1Id}, process.env.JWT_SECRET)}]
};


describe('post/users', () => {
    beforeEach(async () => {
        //await User.deleteMany({});
        await User.remove({});
    });
    it('should register a new user', async function () {
        await request(app).post('/users').send(user1).expect(201)
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
            .then(async (response) => {
                if (_.isEmpty(response.body.user)) throw new Error('login didnt worked')

                // Assertion that response contain the same user as in the db with response
                const user = await User.findById(response.body.user._id);
console.log(response.body.user)
                //expect(response.body.user).toMatchObject({user:user1})
                expect(response.body.user).toMatchObject({name:user.name, email:user.email})
                expect(response.body.user.password).not.toBe(user1.password)

            })
    });
});


describe('get/users/me', () => {
    beforeEach(async () => {
        //await User.deleteMany({});
        await User.remove({});
        await new User(user1).save()
    });
    it('should get the user profile', async function () {
        await request(app).get('/users/me')
            .set({'Authorization': `Bearer ${user1.tokens[0].token}`})
            .send()
            .expect(200)
            .then(response => {
                if (_.isEmpty(response.body)) throw new Error("Couldn't get user profile")
            })
    });
    it('should not get the user profile with wrong Auth', async function () {
        await request(app).get('/users/me')
            .send()
            .expect(401)
    });
});

describe('delete/users/me', () => {
    beforeEach(async () => {
        //await User.deleteMany({});
        await User.remove({});
        await new User(user1).save()
    });
    it('should delete the user profile', async function () {
        await request(app).delete('/users/me')
            .set({'Authorization': `Bearer ${user1.tokens[0].token}`})
            .send()
            .expect(200)

    });
    it('should not delete the user profile with wrong Auth', async function () {
        await request(app).get('/users/me')
            .send()
            .expect(401)
    });
});
