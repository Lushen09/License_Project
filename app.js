const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Admin = require('./dbModel/admin');
const User = require('./dbModel/userReg');
const Applications = require('./dbModel/application');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });


// express app
const app = express();

// connect to database
//const dbURI = 'mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@license.o2yb0.mongodb.net/license?retryWrites=true&w=majority';
const dbURI = "mongodb+srv://lushen09:devi09@license.o2yb0.mongodb.net/license?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(process.env.PORT || 3000))
  .then(console.log("Connection success"))
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

//routes
app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/admin', (req, res) => {
    res.render('adminLogin', {title: 'Login'});
});

app.get('/driver', (req, res) => {
    res.render('driverReg', {title: 'Register'});
});

app.get('/driverLogin', (req, res) => {
    res.render('driverLogin', {title: 'Welcome'});
});

app.get('/logApp', (req, res) => {
    res.render('logApp', {title: 'New application'});
});

// admin login
app.post('/adminMain', (req, res) => {
    console.log(req.body);
    Admin.find({username: req.body.username, password: req.body.password})
    .then(result => { if (result == '') {
        res.render('loginFail');
        } else {
            Applications.find().sort({createdAt: 1})
            .then(result2 => {
                res.render('adminMain', {title: 'Admin', applications: result2});
            })
            .catch(err2 => console.log(err2));
        }
    })
    .catch(err => console.log(err));
});

// admin redirect
app.get('/adminMain', (req, res) => {
    Applications.find().sort({createdAt: 1})
    .then(result2 => {
        res.render('adminMain', {title: 'Admin', applications: result2});
    })
    .catch(err => console.log(err));
});

// admin select application
app.get('/adminUpdate/:id', (req, res) => {
    console.log(req.params.id);
    Applications.find({_id: req.params.id})
    .then(result => {
        res.render('adminUpdate', {applications: result, title: 'Update'});
    })
    .catch(err => console.log(err));
});

// admin update application
app.post('/adminUpdate', (req, res) =>{
    console.log(req.body);
    Applications.findOneAndUpdate({_id: req.body.id}, {status: req.body.status, comments: req.body.comments})
    .then(setTimeout(() => {res.redirect('/adminMain')}, 3000))
    .then(console.log('Entry updated'))
    .catch(err => console.log(err));
});

// registering a new driver
app.post('/newDriver', (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save()
    .then(result => {
        res.render('regSuccess', {title: 'Success'});
    })
    .catch(err => {
        console.log(err);
    });
});

//logging in
app.post('/driverApp', (req, res) => {
    console.log(req.body);
    User.find({idNo: req.body.idNo, password: req.body.password})
    .then(result => {if (result == '') {
        res.render('loginFail', {title: 'Fail'});
    } else {
        Applications.find({'idNo': req.body.idNo})
        .then (result2 => {
        res.render('driverApp', {user: result, applications: result2, title: 'Hub'});
        })
    }})
    .catch(err => console.log(err));
});

// logging application
app.post('/upload', upload.single("document"), (req, res) => {
    console.log(req.file.path);
    const application = new Applications({
        idNo: req.body.idNo,
        name: req.body.firstName + " " + req.body.secondName,
        code: req.body.code,
        licenseNo: req.body.licenseNo,
        contactNo: req.body.contact,
        deliveryAddress: req.body.address,
        status: 'Pending',
        comments: 'Null',
    });
    application.file1.data = fs.readFileSync(req.file.path);
    application.file1.contentType = "document/pdf";
    application.save()
    .then(result => {
        console.log("Success, well done!");
    })
    .then(res.render('applicationSuccess', {idNo: req.body.idNo, name: req.body.firstName, title: 'Success'}))
    .catch(err => {
        console.log(err);
    });
});

// successfull application
app.get('/driverApp/:idNo', (req,res) =>{
    User.find({'idNo': req.params.idNo})
    .then(result1 => Applications.find({'idNo': req.params.idNo})
        .then(result2 => {
        res.render('driverApp', {user: result1, applications: result2, title: 'Hub'})
    }))    
    .catch(err => console.log(err));
});