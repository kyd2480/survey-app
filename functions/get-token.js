// get-token-server.js
const express = require('express');
const { google } = require('googleapis');

const CLIENT_ID     = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI  = 'http://localhost:3000/oauth2callback';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const app = express();

app.get('/', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send']
  });
  res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('Refresh token:', tokens.refresh_token);
    console.log('Access token:', tokens.access_token);
    res.send('토큰 발급 완료! 터미널을 확인하세요.');
    process.exit(0);
  } catch (err) {
    console.error('Error retrieving tokens:', err);
    res.status(500).send('토큰 발급 실패');
  }
});

app.listen(3000, () => {
  console.log('▶ http://localhost:3000 에 접속하면 인증이 시작됩니다.');
});
