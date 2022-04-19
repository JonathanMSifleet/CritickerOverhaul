const fs = require('fs');

const getRandomInt = (max) => Math.floor(Math.random() * max);

const usernames = JSON.parse(fs.readFileSync('../../sharedData/mockAccounts.json')).map(username => username.username);
const reviews = JSON.parse(fs.readFileSync('./loremIpsum.json')).map(review => review.review);
const imdbIDs = JSON.parse(fs.readFileSync('./myRatings.json')).map(id => id.imdbID);

const generatedRatings = [];

usernames.forEach(username => {
  imdbIDs.forEach((imdbID) => {
    if (getRandomInt(10) > 8) return;

    let userReview = undefined;
    if (getRandomInt(3) === 2) userReview = reviews[getRandomInt(reviews.length)];

    let review = {
      imdbID,
      rating: getRandomInt(11) * 10,
      username
    };
    if (userReview) review.review = userReview;

    generatedRatings.push(review);
  });
});

fs.writeFileSync('generatedRatings.json', JSON.stringify(generatedRatings));