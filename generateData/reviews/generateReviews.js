const fs = require('fs');

const getRandomInt = (max) => Math.floor(Math.random() * max);

const usernames = JSON.parse(fs.readFileSync('mockUsernames.json')).map(username => username.name);
const reviews = JSON.parse(fs.readFileSync('mockReviews.json')).map(review => review.review);
const imdbIDs = JSON.parse(fs.readFileSync('myRatings.json')).map(id => id.imdbID);

const generatedReviews = [];

usernames.forEach (username => {
  imdbIDs.forEach((imdbID) => {
    if (getRandomInt(8) === 0) return;

    let userReview = undefined;
    if (getRandomInt(5) === 4) userReview = reviews[getRandomInt(reviews.length)];

    let review = {
      imdbID,
      rating: getRandomInt(11) * 10,
      username
    };
    if(userReview) review.review = userReview;

    generatedReviews.push(review);
  });
});

fs.writeFileSync('generatedReviews.json', JSON.stringify(generatedReviews));