if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const Users = require('./model/user')
const app = express()
const bcrypt = require('bcrypt')
const bcryptjs = require('bcryptjs');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const authController = require('./controller')
const cookieParser = require('cookie-parser');



const initializePassport = require('./passport-config')
initializePassport(passport)

mongoose.connect('mongodb://localhost:27017/nodejs_login', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {console.log('successfully connected to db')}).catch(err => console.log(err.message))



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
  if(req.isAuthenticated()){
    res.render('index.ejs', { name: req.user.name, eid: req.user.email })
  }
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


//--------------------delete account functionality---------//
app.get('/delete', checkAuthenticated, (req, res) =>{
  res.render('delete.ejs')
})

app.post('/DeleteAccount', checkAuthenticated, authController.deletAccount);

//---------successful deleteion message------------//
app.get('/successful', checkNotAuthenticated, (req, res) =>{
  res.render('successful.ejs')
})




app.get('/change_password', checkAuthenticated,  (req, res) => {
  res.render('change_password.ejs')
})

app.post('/change_password', async (req, res) =>{
  var oldpass = req.body.old_password
  var _id
  await Users.findOne({email: req.user.email}).then(answer =>{
    // console.log(answer)
    _id = answer._id
  }).catch(err => console.log('****here**** '+err))

  var newpass = req.body.new_password
  //check if wrong or invalid email id is provided
  // if(_id==null){
  //   req.flash("error_msg", "Please enter correct email id")
  //   res.redirect('/change_password')
  //   return
  // }

  Users.findById(_id, function (err, doc){
    //console.log('doc****'+doc)
    if(err) console.log(err)

    if (!doc) {
    req.flash('error_msg','no user with this email')
    res.redirect('/')
  }

  /*******match old password with new one*******/
  bcrypt.compare(oldpass, doc.password, (err, isMatch) => {
      if (err) throw err;
      if(oldpass==newpass){
        req.flash('error_msg', "old and new password can't be same")
        res.redirect('/change_password')
      }
      else if (isMatch) {
                  bcryptjs.genSalt(10, (err, salt) => {
                    if(err) throw err;
                      bcryptjs.hash(newpass, salt, (err, hash) => {
                          if (err) throw err;
                          doc.password = hash;
                          doc.save().catch(err => console.log(err));
                          req.logout()
                          req.flash( 'success_msg', 'Password changed successfully please login with new password');
                          res.redirect('/login')
                      });
                  });
      } else {
          req.flash('error_msg','wrong old password')
          res.redirect('/change_password')
      }
  });
  })
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
  req.logout()
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login')
})

app.get('/forgot', checkNotAuthenticated, (req, res) => {
  res.render('forgot.ejs')
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
