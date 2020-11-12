This is a recreation of my [my MEAN-stack game-review website](https://github.com/JonathanMSifleet/MEANReviewWebsite), which in itself is a recreation of my [university coursework](https://github.com/JonathanMSifleet/GameReviewWebsite) produced using PHP/CodeIgniter. This project will use DynamoDB and AWS instead of MongoDB and Express.

*******************

All details from previous commits, i.e. token details and secret.pem have been updated and replaced.

*******************
To run:
1. Sign up for an (auth0 account)[auth0.com]
2. Set up an auth0 application:
3. Create an application:
 - Single-Page Web Application
 - Allowed Logout URLS: "(http:/localhost:3000)[http:/localhost:3000]"
 - Allowed Callback URLS: "(http:/localhost:3000)[http:/localhost:3000]"
 - Allowed Web Origins: "(http:/localhost:3000)[http:/localhost:3000]"
 - Grant Types:
   - Implicit
   - Authorization Code
   - Refresh Token
   - Password
4. Settings (left-hand side):
    - Default directory: "Username-Password-Authentication"
5. User management (left-hand side)L
  - Create role:
    - Enter your details
5. Create a (CURL token)[https://gist.github.com/arielweinberger/21d3b72bb4f345a410abb7e98a17cc96]. This is for postman
6. Back to Application settings:
 - Copy certificate
 - Save in project root as "secret.pem"
7. Open terminal in project root
8. Enter "npm i"
9. Open a second terminal in roject root
10. Enter "npm start"
11. Open a third terminal in roject root
12. Enter "ng serve"
- Any changes to AWS must be deploy with "serverless deploy -v"
- Changes to singular AWS lambdas can be deployed with "serverless deploy -f "functionName" -v

If deploying to your own server, all AWS end points will have to be udated
*******************

To Do (incomplete list):
- Reset password field after form submit
  - Password form variable is hashed on client-end so when errors are returned and the form is resubmitted the value in the form is hashed whilst passwordConfirm doesn't change. Setting passwordConfirm = the hash of the original password would then has the already-hashed password causing user to be unable to login due to double hashing
- Refactor
- Add comments

*******************