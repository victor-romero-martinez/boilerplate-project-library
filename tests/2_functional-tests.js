/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {
    let bookId = '' // id for tests

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .set('Content-Type', 'application/json')
          .send({ title: 'Test' })
          .end(function (err, res) {
            assert.equal(res.status, 201)
            assert.isObject(res.body, 'Should be an object')
            assert.property(res.body, '_id', 'Should contains _id')
            assert.property(res.body, 'title', 'Should contains title')
            bookId = res.body._id
            done();
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .set('Content-Type', 'application/json')
          .send({ title: '' })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field title', 'Should be an error response')
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'Respnse should be an array')
            done();
          })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/{_id}')
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists', 'Response should be an errror messaje')
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get(`/api/books/${bookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isObject(res.body, 'Response should be an Object')
            assert.hasAllKeys(res.body, {
              _id: String,
              title: String,
              comments: Array,
              __v: Number
            }, 'Should have all keys')
            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      const comment = 'test'

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .set('Content-Type', 'application/json')
          .send({ comment })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.comments, comment, 'Sould be have a commnet')
            assert.hasAnyKeys(res.body, { _id: String, title: String, commentcount: Number }, 'Should be have any property')
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field comment', 'Response should with error message')
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/{_id}')
          .send({ comment })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists', 'Response should be an error message')
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete(`/api/books/${bookId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'delete successful', 'Should be an successfully message')
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/{_id}')
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists', 'Should be an error message')
            done();
          })
      });

    });

  });

});
