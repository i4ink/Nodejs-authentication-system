if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const Users = require('./model/user')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const authController = require('./controller')
const cookieParser = require('cookie-parser');


// to implement forgot password
/*
const uuidv1 = require('uuid/v1');
//const { createUser, getUser, updateUser } = require("./model/users");
const { getResetRequest, createResetRequest } = require("./model/resetRequests");
const sendResetLink = require("./sendEmail");
*/

const initializePassport = require('./passport-config')
initializePassport(
  passport
  /*
  //email => users.find(user => user.email === email),
  async email => {
    await Users.find({email: email}).then(result =>{
      console.log('is email correct\n',result)
      return result
    }).catch(err =>{
      console.log(err.message)
    })
  },

  async id =>  {
    await Users.find({id: id}, function (err, docs) {}).then(result =>{
      console.log('is id correct\n',result)
      return result
    }).catch(err =>{
      console.log(err.message)
    })
  }
  /*
  email => Users.find({email: email}).then(result =>{
    return result
  }).catch(err =>{
    console.log(err.message)
  }),
  //id => users.find(user => user.id === id)
  id => Users.find({id: id}).then(result =>{
    return result
  }).catch(err =>{
    console.log(err.message)
  })
  */
)

mongoose.connect('mongodb://localhost:27017/nodejs_login', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {console.log('successfully connected to db')}).catch(err => console.log(err.message))


//const users = []

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})




//------------ Reset Password Route ------------//
app.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});

//------------ Reset Password Handle ------------//
app.post('/reset/:id', authController.resetPassword);

// forgot password form page
app.get('/forgot', checkNotAuthenticated,  (req, res) => {
  res.render('forgot.ejs')
})

//------------ Forgot Password Handle ------------//
app.post('/forgot', checkNotAuthenticated, authController.forgotPassword);


//------------ Reset Password Handle ------------//
app.get('/forgot/:token', checkNotAuthenticated, authController.gotoReset);






app.get('/change_password', checkAuthenticated,  (req, res) => {
  res.render('change_password.ejs')
})


app.post('/change_password',checkAuthenticated, (req, res) =>{
  // res.send('sorry!! this functionality is not yet complete')
  // var cid = req.session.id;

  req.flash('error_msg', 'sorry this functionality is not yet added!');
  res.redirect('/change_password')

  /*
  let cur_email = req.session;
  console.log('this is current email -: ' + cur_email)
  if(cur_email.email){
    var old_pass = req.body.old_password;
    var new_pass = req.body.new_password;
    var confirm_pass = req.body.confirm_password;
    Users.findOne({ email : cur_email }, (err, cur_user) =>{
      if(cur_user != null){
        var hash = cur_user.password;
        bcrypt.compare(old_pass, hash, function(err, res1) {
          if(res1){
            // password matched
            if(new_pass == confirm_pass){
                  bcryptjs.genSalt(10, (err, salt) => {
                      bcryptjs.hash(new_pass, salt, (err, hash) => {
                          if (err) throw err;
                          cur_user.password = hash;
                          cur_user.save().then(user => {
                                  console.log('successfully changed password')
                                  req.flash(
                                      'success_msg',
                                      'Password changed successfully'
                                  );
                                  res.redirect('/');
                              })
                              .catch(err => console.log(err));
                      });
                  });
            }else{
              req.flash('error_msg', 'new password does not matched');
              console.log('here1')
              res.redirect('/change_password')
            }
          }else{
              req.flash('error_msg', 'Wrong old password');
              console.log('here2')
              res.redirect('/change_password')
          }
        })
      }else{
            req.flash('error_msg', 'Login first');
              console.log('here3')
            res.redirect('/change_password')
      }
    } )
  }
  else{
  req.flash('error_msg', 'Please login first');
  console.log('here4')
  res.redirect('/login')
  }
  */

})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

//------------ Register POST Handle ------------//
app.post('/register', checkNotAuthenticated, authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
app.get('/activate/:token', authController.activateHandle);
/*
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      // users.push({
      //   id: Date.now().toString(),
      //   name: req.body.name,
      //   email: req.body.email,
      //   password: hashedPassword
      // })

     var len = 0
    await Users.find({email:req.body.email}).then(answers =>{
      len = answers.length
      //console.log('answers length '+answers.length)
    }).catch(err =>{
      console.log(err.message)
      // res.json({
      //   confirmation: 'fail',
      //   data: err.message
      // })

    })
    //console.log('len '+len)
    if(len > 0){
      res.send('this email is already registered')
      //res.redirect(301, '/register')
      //res.redirect('/register')
    }
    else{
      // db
      const response = await Users.create({ 
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      }, function (err) {
        if (err) {
          console.log(err)
          return
        }
        console.log('successfully inserted');
        // saved!
      });
      //console.log('User created successfully: ', response)
        res.redirect('/login')
    }

  } catch(err){
    console.log(err)
    res.redirect('/register')
  }
  //console.log(Users.find())
})
*/

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error_msg', 'Please log in first!');
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    //req.flash('success_msg','hello')
    return res.redirect('/')
  }
  next()
}



//below is code for reset password implementation
/*
app.post("/forgot", (req, res) => {
    const thisUser = Users.find(user=>user.email===req.body.email)
    if (thisUser) {
        const id = uuidv1();
        const request = {
            id,
            email: thisUser.email,
        };
        createResetRequest(request);
        sendResetLink(thisUser.email, id);
    }
    res.status(200).json();
});

app.patch("/reset", (req, res) => {
    const thisRequest = getResetRequest(req.body.id);
    if (thisRequest) {
        const user = users.find(user=>user.email===req.body.email)
        //const user = getUser(thisRequest.email);
        bcrypt.hash(req.body.password, 10).then(hashed => {
            user.password = hashed;
            updateUser(user);
            res.status(204).json();
        })
    } else {
        res.status(404).json();
    }
});


function updateUser(user) {
    const thisUserIndex = users.findIndex(local => local.email === user.email);
    users[thisUserIndex] = user;
}
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
// app.listen(3000)