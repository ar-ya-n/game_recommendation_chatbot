const https = require('https');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log(JSON.parse(data)); });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
