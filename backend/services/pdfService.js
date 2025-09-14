const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractText = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }

      pdfParse(data).then((pdfData) => {
        resolve(pdfData);
      }).catch(reject);
    });
  });
};

module.exports = { extractText };
