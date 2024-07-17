const { google } = require('googleapis');

const CLIENT_ID = '565494729306-e6bvlreqd1iof67tb4ghnac1kq0tjru6.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'http://localhost';

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );
  
  // Generate the URL for the authentication consent page
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send'],
  });
  
  console.log('Authorize this app by visiting this url:', authUrl);
  
  // After obtaining the code from the URL, use it to get tokens
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  rl.question('Enter the code from that page here: ', (code) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        console.error('Error getting tokens:', err);
        return;
      }
      console.log('Tokens acquired:', tokens);
      rl.close();
    });
  });
  