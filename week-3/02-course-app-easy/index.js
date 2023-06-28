const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function isValidUser(headers) {
  const username = headers.username;
  const password = headers.password;

  ADMINS.forEach(admin => {
    if(admin.username === username && admin.password === password) {
      return true;      
    }
  });
  return false;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { username } = req.body;

  //check if admin with same creds alreday exists
  const index = ADMINS.findIndex((admin) => admin.username === username);
  if (index > -1) {
    res.status(400).send("Admin already Exists");
  } else {
    ADMINS.push(req.body);
    res.status(200).json({ message: "Admin created successfully" });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let userValid = isValidUser(req.headers);

  if (!userValid) {
    res.status(400).send("No Admin with such creds exists");
  } else {  
    res.status(201).json({ message: "Logged in successfully" });
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const body = req.body;
  const headers = req.headers;
  const _id = COURSES.length + 1;

  const index = ADMINS.findIndex((admin) => admin.username === headers.username && admin.password === headers.password);

  if(index <= -1) {
    res.status(400).send("No Admin with such creds exists");
  } else {
    const dataObject = {
      id: _id,
      title: body.title,
      description: body.description,
      price: body.price,
      imgLink: body.imgLink,
      published: body.published
    }
  
    COURSES.push(dataObject);
    //res.status(200).json({message: 'done', id: _id});
    res.status(200).send(index);
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
