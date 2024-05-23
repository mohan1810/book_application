const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // console.log(users)
  username = req.body.username
  password = req.body.password
  if (!username || !password){
    res.status(404).message("Error logging in")
  }
  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  review = req.query.review
  reqisbn = req.params.isbn
  if (reqisbn in books){
    books[reqisbn]["review"] = review
    return res.status(200).json({message: "Review Added Successfully"});
  }else{
    return res.status(500).json({message: "Book with this ISBN is not found"});
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  reqisbn = req.params.isbn
  if (reqisbn in books){
    books[reqisbn]["review"] = {}
    return res.status(200).json({message: `Review removed successfully for ISBN ${reqisbn} given by user ${req.session.authorization["username"]}"`});
  }else{
    return res.status(500).json({message: "Book with this ISBN is not found"});
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;