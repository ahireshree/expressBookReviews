const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
public_users.get('/', async (req, res) => {
    try {
        // Simulate async fetching using a Promise
        const allBooks = await new Promise((resolve, reject) => {
            if (books) {
                resolve(Object.values(books));
            } else {
                reject("No books found");
            }
        });
        res.status(200).json(allBooks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error });
    }
});

// Get book details based on ISBN using async/await + Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        // Fetch all books from base endpoint
        const response = await axios.get('http://localhost:5000/');
        const booksData = response.data;

        const book = booksData[isbn];

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }


        res.status(200).json({
            isbn,
            ...book
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching book",
            error: error.message
        });
    }
});


  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        // Fetch all books from base endpoint
        const response = await axios.get('http://localhost:5000/');
        const booksData = response.data;

        // Include ISBN in response
        const result = Object.entries(booksData)
            .filter(([isbn, book]) =>
                book.author.toLowerCase() === author
            )
            .map(([isbn, book]) => ({
                isbn,
                ...book
            }));

        res.status(200).json({
            count: result.length,
            books: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books by author",
            error: error.message
        });
    }
});



// Get all books based on title using async/await + Axios
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        // Fetch all books from base endpoint
        const response = await axios.get('http://localhost:5000/');
        const booksData = response.data;

        // Include ISBN in response
        const result = Object.entries(booksData)
            .filter(([isbn, book]) =>
                book.title.toLowerCase() === title
            )
            .map(([isbn, book]) => ({
                isbn,
                ...book
            }));

        res.status(200).json({
            count: result.length,
            books: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books by title",
            error: error.message
        });
    }
});



public_users.get("/review/:isbn", (req, res) => {
    const isbn = Number(req.params.isbn);
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews || Object.keys(book.reviews).length === 0) {
        return res.status(200).json({ message: "No reviews found for this book." });
    }

    return res.status(200).json(book.reviews);
});

async function fetchAllBooks() {
    try {
      const response = await axios.get('http://localhost:5000/books');
      const allBooks = response.data;
      console.log("All books available in the shop:", allBooks);
    } catch (error) {
      console.error("Error fetching all books:", error.message);
    }
  }


module.exports.general = public_users;
