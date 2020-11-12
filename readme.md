This is a recreation of my [my MEAN-stack game-review website](https://github.com/JonathanMSifleet/MEANReviewWebsite), which in itself is a recreation of my [university coursework](https://github.com/JonathanMSifleet/GameReviewWebsite) produced using PHP/CodeIgniter. This project will use DynamoDB and AWS instead of MongoDB and Express.

*******************
To run:

1. Open terminal in project root
2. Enter "npm i"
3. Open a second terminal in roject root
2. Enter "npm start"
5. Open a third terminal in roject root
6. Enter "ng serve"

*******************

To Do (incomplete list):
- Reset password field after form submit
  - Password form variable is hashed on client-end so when errors are returned and the form is resubmitted the value in the form is hashed whilst passwordConfirm doesn't change. Setting passwordConfirm = the hash of the original password would then has the already-hashed password causing user to be unable to login due to double hashing
- Refactor
- Add comments

*******************