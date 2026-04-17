const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/server');

describe('App API Endpoints', () => {
    it('GET / should return the API running message', (done) => {
        request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('Charme Active API está rodando!');
                
                done();
            });
    });

    it('GET /api/v1/products should respond with JSON', (done) => {
        request(app)
            .get('/api/v1/products')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                // Ignore errors related to DB or empty mock if 200 is returned
                if (err) return done(err);
                
                expect(res.body).to.be.an('array'); // Assuming products route returns an array
                done();
            });
    });
});
