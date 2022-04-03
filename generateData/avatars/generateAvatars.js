const fs = require('fs');

const getRandomInt = (max) => Math.floor(Math.random() * max);

const usernames = JSON.parse(fs.readFileSync('../reviews/mockUsernames.json')).map(username => username.name);
const avatars = JSON.parse(fs.readFileSync('./encodedImages.json'));

const avatarPayload = [];

usernames.forEach(username => {
  avatarPayload.push({
    image: avatars[getRandomInt(avatars.length)],
    username
  });
});

fs.writeFileSync('avatarPayload.json', JSON.stringify(avatarPayload));