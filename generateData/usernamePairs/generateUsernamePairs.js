const fs = require('fs');

const usernames = JSON.parse(fs.readFileSync('usernames.json')).map(username => username.username);

const totalCombinations = (usernames.length * usernames.length) - usernames.length;

const usernamePairs = [];

let i = 0;
usernames.forEach((usernameOne) => {
  usernames.forEach((usernameTwo) => {
    console.log(`Combination ${i} out of ${totalCombinations}`);
    i++;
    if (usernameOne === usernameTwo) return;

    usernamePairs.push({usernamePair: `${usernameOne}/${usernameTwo}`});
  });
});

fs.writeFileSync('generatedPairs.json', JSON.stringify(usernamePairs));