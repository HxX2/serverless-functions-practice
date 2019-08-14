require('dotenv').config()
const fetch = require('node-fetch')
const { EMAIL_TOKEN } = process.env
exports.handler = async event => {
  const uid = Math.ceil(Math.rand() * 9999);
  const email = JSON.parse(event.body).payload.email
  console.log(`Recieved a submission: ${email}`)
  return fetch(`https://api.buttondown.email/v1/subscribers/${uid}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${EMAIL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(`Submitted to Buttondown:\n ${data}`)
    })
    .catch(error => ({ statusCode: 422, body: String(error) }))
}