const fs = require('fs');

const usernames = JSON.parse(fs.readFileSync('../../sharedData/mockAccounts.json')).map(account => account.username);
usernames.push('jonathanmsifleet');

const totalCombinations = usernames.length * usernames.length;

const usernamePairs = [];

let i = 1;
usernames.forEach((usernameOne) => {
  usernames.forEach((usernameTwo) => {
    console.log(`Combination ${i} out of ${totalCombinations}`);
    i++;
    if (usernameOne === usernameTwo) return;

    usernamePairs.push(`${usernameOne}/${usernameTwo}`);
  });
});

usernamePairs.sort();

fs.writeFileSync('generatedPairs.json', JSON.stringify(usernamePairs));