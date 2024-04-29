const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Register the user
public_users.post('/register', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return new Promise((resolve, reject) => { // Create a Promise
      try {
        const allBooks = books; // Assuming books are readily available
        resolve(allBooks); // Resolve the Promise with all books
      } catch (error) {
        reject(error); // Reject with an error if there's an issue
      }
    })
    .then((allBooks) => { // Handle successful retrieval (using then)
      res.json(allBooks);
    })
    .catch((error) => { // Handle errors (using catch)
      console.error("Error retrieving all books:", error);
      res.status(500).send("Internal Server Error"); // Send generic error message
    });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return new Promise((resolve, reject) => { // Create a Promise
      try {
        if (books.hasOwnProperty(isbn)) {
          resolve(books[isbn]); // Resolve with the matching book if found
        } else {
          reject(new Error("Book not found for ISBN: " + isbn)); // Reject with error
        }
      } catch (error) {
        reject(error); // Reject with any other errors
      }
    })
    .then((book) => { // Handle successful retrieval (using then)
      res.json(book);
    })
    .catch((error) => { // Handle errors (using catch)
      console.error("Error retrieving book by ISBN:", error);
      res.status(404).send(error.message); // Send error message in response
    });
  });
  

// Get book details based on author (uses Promise with resolve/reject)
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  return new Promise((resolve, reject) => { // Create a Promise
    const booksByAuthor = [];
    for (const key in books) { // Loop through each key (ISBN) in the books object
      if (books[key].author === authorName) {
        booksByAuthor.push(books[key]); // Add matching book object to the array
      }
    }
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor); // Resolve the Promise with matching books
    } else {
      reject(new Error("No books found for author: " + authorName)); // Reject with an error
    }
  })
  .then((booksByAuthor) => { // Handle successful search (using then)
    res.json(booksByAuthor);
  })
  .catch((error) => { // Handle search error (using catch)
    console.error("Error finding books by author:", error);
    res.status(404).send(error.message); // Send error message in response
  });
});

// Get all books based on title (uses Promise with resolve/reject)
public_users.get('/title/:title', function (req, res) {
  const bookTitle = req.params.title;
  return new Promise((resolve, reject) => { // Create a Promise
    const booksByTitle = [];
    for (const key in books) { // Loop through each key (ISBN) in the books object
      if (books[key].title === bookTitle) {
        booksByTitle.push(books[key]); // Add matching book object to the array
      }
    }
    if (booksByTitle.length > 0) {
      resolve(booksByTitle); // Resolve the Promise with matching books
    } else {
      reject(new Error("No books found for Title: " + bookTitle)); // Reject with an error
    }
  })
  .then((booksByTitle) => { // Handle successful search (using then)
    res.json(booksByTitle);
  })
  .catch((error) => { // Handle search error (using catch)
    console.error("Error finding books by title:", error);
    res.status(404).send(error.message); // Send error message in response
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn) && books[isbn].reviews) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).send("No reviews found for ISBN: " + isbn);
  }
});

module.exports.general = public_users;

