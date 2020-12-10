This is a recreation of my [my MEAN-stack game-review website](https://github.com/JonathanMSifleet/MEANReviewWebsite), which in itself is a recreation of my [university coursework](https://github.com/JonathanMSifleet/GameReviewWebsite) produced using PHP/CodeIgniter. This project will use DynamoDB and AWS instead of MongoDB and Express.

*******************

All details from previous commits, i.e. token details and secret.pem have been updated and replaced.

*******************

UNFINISHED:

Learning how to use markdown ignore that it's broken:
To run:
1. Sign up for an https://auth0.com
2. Set up an auth0 application:
3. Create an application:
 * Single-Page Web Application:
 * Allowed Logout URLS: [http:/localhost:3000](http:/localhost:3000)
 * Allowed Callback URLS: [http:/localhost:3000](http:/localhost:3000)
 * Allowed Web Origins: [http:/localhost:3000](http:/localhost:3000)
 * Grant Types:
   * Implicit
   * Authorization Code
   * Refresh Token
   * Password
4. Settings (left-hand side):
  * Default directory: "Username-Password-Authentication"
5. User management (left-hand side):
  * Create role:
  * Enter your details
6. Create a [CURL token](https://gist.github.com/arielweinberger/21d3b72bb4f345a410abb7e98a17cc96). This is for postman
7. Back to Application settings:
  * Copy certificate
  * Save in project root as "secret.pem"
9. Clone project
10. Delete node_modules folder
11. Open terminal in project root
12. Enter "npm i"
13. Discard change to singular file in node_modules via git or GitHub
14. Open a second terminal in roject root
15. Enter "npm start"
16. Open a third terminal in roject root
17. Enter "ng serve"

- Any changes to AWS must be deploy with "serverless deploy -v"
- Changes to singular AWS lambdas can be deployed with "serverless deploy -f "functionName" -v

If deploying to your own server, all AWS end points will have to be udated
*******************
