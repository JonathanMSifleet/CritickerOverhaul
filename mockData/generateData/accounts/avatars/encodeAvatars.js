const fs = require('fs');
const imageToBase64 = require('image-to-base64');


(async () => {
  const avatarPromises = [];

  for (let i = 0; i <= 49; i++) {
    avatarPromises.push(new Promise(async resolve => {
      let base64Image = await imageToBase64(`./imgs/${i}.jpg`);
      resolve(`data:image/jpeg;base64,${base64Image}`);
    }));
  }

  const results = await Promise.all(avatarPromises);
  fs.writeFileSync('encodedImages.json', JSON.stringify(results));
})();

