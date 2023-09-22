// Create web server

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('common'));

// Data
let comments = require('./data/comments');
let contacts = require('./data/contacts');
let products = require('./data/products');

// Routes

// GET /comments
// Returns all comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// GET /comments/:id
// Returns one comment by id
app.get('/comments/:id', (req, res) => {
  const comment = comments.find(comment => comment._id === Number(req.params.id));
  res.json(comment);
});

// POST /comments
// Creates a new comment
app.post('/comments', [
  check('comment').isLength({ min: 5 }),
  check('username').exists(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(error => error.msg) });
  }
  const newComment = {
    _id: comments.length + 1,
    body: req.body.comment,
    postId: 1,
  };
  comments.push(newComment);
  res.json(newComment);
});

// PUT /comments/:id
// Updates one comment by id
app.put('/comments/:id', [
  check('comment').isLength({ min: 5 }),
  check('username').exists(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(error => error.msg) });
  }
  const comment = comments.find(comment => comment._id === Number(req.params.id));
  comment.body = req.body.comment;
  res.json(comment);
});

// DELETE /comments/:id
// Deletes one comment by id
app.delete('/comments/:id', (req, res) => {
  const comment = comments.find(comment => comment._id === Number(req.params.id));
  comment.isActive = false;
  res.send('Comment deleted');
});

// GET /contacts
// Returns all contacts
app.get('/contacts', (req, res) =>
