const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function isValidAdmin(headers) {
  const username = headers.username;
  const password = headers.password;
  let userFound = false;

  ADMINS.forEach(admin => {
    if(admin.userName === username && admin.password === password) {
      userFound = true;  
    }
  });

  return userFound;
}

function isValidCourse(courseId) {
  const index = COURSES.findIndex((course) => course.id === parseInt(courseId));

  return index;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { userName } = req.body;

  //check if admin with same creds alreday exists
  const index = ADMINS.findIndex((admin) => admin.userName === userName);
  if (index > -1) {
    res.status(400).send("Admin already Exists");
  } else {
    ADMINS.push(req.body);
    res.status(200).json({ message: "Admin created successfully" });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let userValid = isValidAdmin(req.headers);
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

  const index = ADMINS.findIndex((admin) => admin.userName === headers.username && admin.password === headers.password);

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
    res.status(200).json({message: 'done', id: _id});
    //res.status(200).json(COURSES);
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  if(isValidAdmin(req.headers)) {
    res.status(200).json(COURSES);
  } else {
    res.status(401).json({msg: "Invalid creds"});
  }

});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const adminRole = isValidAdmin(req.headers);
  const body = req.body;

  if(adminRole) {
    const index = isValidCourse(req.params.courseId);
    if(index >= 0) {
       const course = COURSES[index];
       course.title = body.title;
       course.description = body.description;
       course.price = body.price;
       course.imgLink = body.imgLink;
       course.published = body.published;
       res.status(200).json(COURSES);
    } else {
      res.status(401).json({msg: "Invalid course"});  
    }
  } else {
    res.status(401).json({msg: "Invalid creds"});
  }
});



// ******************************************************************************************************************************



// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const userName = req.body.userName;
  const password = req.body.password;

  const index = USERS.findIndex((user) => user.userName === userName && user.password === password);
  if (index > -1) {
    res.status(400).send("User already Exists");
  } else {
    USERS.push(req.body);
    res.status(200).json({ message: "User created successfully" });
  }
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
