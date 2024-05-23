const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  users.push({"username":username,"password":password})
  return res.status(200).json({message: "User Registered Successfully. Now You can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({"books":books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let req_isbn = req.params.isbn
  return res.status(200).json({books: books[req_isbn]});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let reqAuthor = req.params.author
  bookList = []
  for (isbn in books){
    if (books[isbn]["author"] === reqAuthor){
      bookList.push({
        title : books[isbn]["title"],
        reviews : books[isbn]["reviews"],
        isbn : isbn
      })
    }
  }
  return res.status(200).json({booksbyauthor: bookList
});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let reqTitle = req.params.title
  bookList = []
  for (isbn in books){
    if (books[isbn]["title"] === reqTitle){
      bookList.push({
        author : books[isbn]["author"],
        reviews : books[isbn]["reviews"],
        isbn : isbn
      })
    }
  }
  return res.status(200).json({booksbytitle: bookList}
                      );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).json({message: books[req.params.isbn]['reviews']});
});

module.exports.general = public_users;


// async function getBooks(){
//   try {
//     response = await axios.get("http://localhost:5000/")
//     console.log(response.data )
//   }catch (err) {
//     console.log(err)
//   }
  
// }

// function getBooksByIsbn(isbn) {
//   url = `http://localhost:5000/isbn/${isbn}`
//   axios.get(url)
//       .then(response => {
//       console.log(response.data); // Handle the response data
//       return response.data; // Optionally return the data
//       })
//       .catch(error => {
//       console.error('Error fetching data:', error); // Handle any errors
//       });
// }

// async function getBooksByAuthor(author){
//   try {
//     response = await axios.get(`http://localhost:5000/author/${author}`)
//     console.log(response.data)
//   }catch (err) {
//     console.log(err)
//   }
  
// }

// function getBooksByTitle(title) {
//   axios.get(`http://localhost:5000/title/${title}`)
//       .then(response => {
//       console.log(response.data); // Handle the response data
//       return response.data; // Optionally return the data
//       })
//       .catch(error => {
//       console.error('Error fetching data:', error); // Handle any errors
//       });
// }