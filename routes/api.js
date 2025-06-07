/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose')
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
      if (!title || title.trim() === '') return res.status(200).send('missing required field title')
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
      let _id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(200).send('no book exists')

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(_id)

        if (book) {
          res.json(book)
        } else {
          res.status(404).send('no book exists')
        }
      } catch (error) {
        res.status(500).json(error.message)
      }
    })

    .post(async function (req, res) {
      let _id = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(200).send('no book exists')
      if (!comment) return res.status(200).send('missing required field comment')

      try {
        const result = await Book.findByIdAndUpdate(_id, { $push: { comments: comment } }, { new: true })
        if (result) {
          res.json(result)
        } else {
          res.status(404).send('no book exists')
        }
      } catch (error) {
        res.status(500).json(error.message)
      }
    })

    .delete(async function (req, res) {
      let _id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(200).send('no book exists')

      //if successful response will be 'delete successful'
      try {
        const result = await Book.findOneAndDelete({ _id })

        if (!result) {
          res.status(404).send('no book exists')
        } else {
          res.send('delete successful')
        }
      } catch (error) {
        res.status(500).json(error.message)
      }
    });

};
