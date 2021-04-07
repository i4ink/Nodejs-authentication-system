//const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const User = require('./model/user');

exports.registerHandle = (req, res) => {
    const { name, email, password } = req.body;
    let errors = [];


    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password
        });
    } else {
        /********password validated******/
        User.findOne({ email: email }).then(user => {
            if (user) {
                /********user already exists********/
                errors.push({ msg: 'Email ID already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password
                });
            } else {

                const oauth2Client = new OAuth2(
                    "632545369287-u762m8i3j6g861c2lr06jrhlu0k1ju8p.apps.googleusercontent.com", // ClientID
                    "QLtHiNB-vyz8bwCTfE8pjR-V", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04NRIPBmPEzyyCgYIARAAGAQSNwF-L9IrlK4JQXYQ2KKpwolnvzuxwt_bGV8o3UgRarsuHYxAJDU7Xy4YBr8Nv3BjDwaQ-mzfimE"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "shivam.k@iiitg.ac.in",
                        clientId: "632545369287-u762m8i3j6g861c2lr06jrhlu0k1ju8p.apps.googleusercontent.com",
                        clientSecret: "QLtHiNB-vyz8bwCTfE8pjR-V",
                        refreshToken: "1//04NRIPBmPEzyyCgYIARAAGAQSNwF-L9IrlK4JQXYQ2KKpwolnvzuxwt_bGV8o3UgRarsuHYxAJDU7Xy4YBr8Nv3BjDwaQ-mzfimE",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"Nodejs Login Admin" <shivam.k@iiitg.ac.in>', // sender address
                    to: email, // list of receivers
                    subject: "Account Verification: NodeJS Auth ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        req.flash(
                            'error_msg',
                            'Something went wrong on our end. Please register again.'
                        );
                        res.redirect('/login');
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        req.flash(
                            'success_msg',
                            'Activation link sent to email ID. Please activate to log in.'
                        );
                        res.redirect('/login');
                    }
                })

            }
        });
    }
}

/*******activate account with email activation link**********/
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please register again.'
                );
                res.redirect('/register');
            }
            else {
                const { name, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        /*****user already exists*****/
                        req.flash(
                            'error_msg',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/login');
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        req.flash(
                                            'success_msg',
                                            'Account activated. You can now log in.'
                                        );
                                        res.redirect('/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}