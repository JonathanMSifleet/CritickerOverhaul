const fs = require('fs');

const getRandomInt = (max) => Math.floor(Math.random() * max);

const usernames = JSON.parse(fs.readFileSync('../accounts/mockAccounts.json')).map(username => username.username);
const reviews = JSON.parse(fs.readFileSync('mockReviews.json')).map(review => review.review);
const imdbIDs = JSON.parse(fs.readFileSync('myRatings.json')).map(id => id.imdbID);

const generatedRatings = [];

let i = 0;
usernames.forEach(username => {
  imdbIDs.forEach((imdbID) => {
    // initial 50 people must have matching reviews
    if (i > 30) {
      if (getRandomInt(50) === 0) return;
    }

    let userReview = undefined;
    if (getRandomInt(5) === 4) userReview = reviews[getRandomInt(reviews.length)];

    let review = {
      imdbID,
      rating: getRandomInt(11) * 10,
      username
    };
    if(userReview) review.review = userReview;

    generatedRatings.push(review);
    i++;
  });
});

fs.writeFileSync('generatedRatings.json', JSON.stringify(generatedRatings));