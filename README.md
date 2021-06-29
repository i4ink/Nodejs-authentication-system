# Node.js Authentication
* Node.js authentication system with functionality of login, logout, register, email verification, change password , reset password etc. It uses passport authentication, express session maintainance, bcrypt for password hashing, nodemailer and OAuth2 to generate and send emails , JWT token to generate verification and reset links and mongodb as database to store user information.

* **Tech stack -:** Node.js, express.js, mongodb, googleapis, JWT, moongoose, Javascript, HTML, CSS, bootstrap.  

# Setup 
* **clone this repo using `git clone https://github.com/shivam6522/Nodejs_login.git`**

* **Run `npm install` to install all the dependencies**

* **modify your mongo db connection url as per your database name in [server.js](server.js)**

* **create a ".env" file in the root folder which contains "server.js" file and set the following values**
    * SESSION_SECRET=
    * GMAIL_ID=
    * CLIENT_ID=
    * CLIENT_SECRET=
    * REFRESH_TOKEN=
    * JWT_KEY=any_valid_string
    * JWT_RESET_KEY=any_valid_string
    * PORT=3000

    * use this [video](https://www.youtube.com/watch?v=-rcRf7yswfM) to set up your client id, client secret and refresh token 
    * keep any string as your session secret (longer and complex session secret is preferred)

* **All done!! Now you can run the application just by the command `npm run start`**
