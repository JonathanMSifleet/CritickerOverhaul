This is a recreation of my [my MEAN-stack game-review website](https://github.com/JonathanMSifleet/MEANReviewWebsite), which in itself is a recreation of [a piece of university coursework](https://github.com/JonathanMSifleet/GameReviewWebsite) which was produced using PHP/CodeIgniter. This project will use DynamoDB and AWS instead of MongoDB and Express.

Please check TODO.md

---

If deploying to your own AWS account, all AWS end points, resource names etc. will have to be updated

---

Preliminary setup:

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
- Save in project root/backend as "secret.pem"

---

Set-up:

1. Run "npm run iPax" in terminal
2. Run "npm run fullDeploy" in terminal
3. Update bucket names and other deployment specific details such as endpoint URLs in project root/backend/serverless.yml and services in root/client/src/app
