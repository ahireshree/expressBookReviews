const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    res.status(200).json(result);  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    res.status(200).json(result);  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book.reviews);
});

module.exports.general = public_users;
