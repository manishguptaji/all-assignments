const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];


const adminMiddleWare = (req, res, next) => {
  const {username, password} = req.headers;

  const isAdmin = ADMINS.find((admin) => admin.userName === username && admin.password === password)
  if(isAdmin) {
    next();
  } else {
    res.status(403).send("No Admin with such creds exists");
  }
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
  const index = ADMINS.find((admin) => admin.userName === userName);
  if (index) {
    res.status(400).send("Admin already Exists");
  } else {
    ADMINS.push(req.body);
    res.status(200).json({ message: "Admin created successfully" });
  }
});

app.post('/admin/login', adminMiddleWare, (req, res) => {
  res.status(200).json({ message: "Logged in successfully" });
});

app.post('/admin/courses', adminMiddleWare, (req, res) => {
  // logic to create a course
  const body = req.body;
  const _id = COURSES.length + 1;

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
});

app.get('/admin/courses', adminMiddleWare, (req, res) => {
  res.status(200).json(COURSES);
});

app.put('/admin/courses/:courseId', adminMiddleWare, (req, res) => {
  // logic to edit a course
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
