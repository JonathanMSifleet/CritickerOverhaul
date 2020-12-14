This is a recreation of my [my MEAN-stack game-review website](https://github.com/JonathanMSifleet/MEANReviewWebsite), which in itself is a recreation of [a piece of university coursework](https://github.com/JonathanMSifleet/GameReviewWebsite) which was produced using PHP/CodeIgniter. This project will use DynamoDB and AWS instead of MongoDB and Express.

---

Set-up:

1. Open terminal in project root
2. Enter "npm run installPackages" NOT 'npm i' (mandatory to fix bcrypt error)
3. Create a symlink from root/node_modules to root/backend
4. Enter "npm run deploy"

Notes:
Back end can be deployed separately via:

- "npm run slsDeploy"

Front end can be ran locally via:

- "npm run ngServe"

---

To add authentication:

1. Sign up for an https://auth0.com
2. Set up an auth0 application:
3. Create an application:

- Single-Page Web Application:
- Allowed Logout URLS: [http:/localhost:3000](http:/localhost:3000)
- Allowed Callback URLS: [http:/localhost:3000](http:/localhost:3000)
- Allowed Web Origins: [http:/localhost:3000](http:/localhost:3000)
- Grant Types:
  - Implicit
  - Authorization Code
  - Refresh Token
  - Password

4. Settings (left-hand side):

- Default directory: "Username-Password-Authentication"

5. User management (left-hand side):

- Create role:
- Enter your details

6. Create a [CURL token](https://gist.github.com/arielweinberger/21d3b72bb4f345a410abb7e98a17cc96). This is for postman.
7. Back to Application settings:

- Copy certificate
- Save in project root as "secret.pem"

If deploying to your own AWS account, all AWS end points will have to be updated
