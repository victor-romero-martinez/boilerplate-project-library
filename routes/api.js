/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/Books.js')

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (_req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.aggregate([
          {
            $project: {
              _id: 1,
              title: 1,
              comments: 1,
              commentcount: { $size: "$comments" }
            }
          }
        ])
        res.json(books)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      const book = new Book({ title })

      try {
        const { _id, title } = await book.save()
        res.status(201).json({ _id, title })
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    })

    .delete(async function (_req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({})
        res.send('complete delete successful')
      } catch (error) {
        res.status(500).json(error.message)
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid)
        res.json(book)
      } catch (error) {
        res.status(500).json(error.message)
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {
        await Book.updateOne(
          { _id: bookid },
          { $push: { comments: comment } }
        )
        const updated = await Book.findById(bookid)
        res.json(updated)
      } catch (error) {
        res.status(500).json(error.message)
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        await Book.deleteOne({ _id: bookid })
        res.send('delete successful')
      } catch (error) {
        res.status(500).json(error.message)
      }
    });

};
