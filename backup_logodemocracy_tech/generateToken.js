import { google } from 'googleapis';
import readline from 'readline';

const CLIENT_ID = "654207482861-b4ev9a7npam6gm46quu0io4j05aqmqp0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
  prompt: 'consent'
});

console.log('\n👉 Abre este link en tu navegador:\n');
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nPega aquí el código que te da Google: ', async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('\n🔥 REFRESH TOKEN:\n');
    console.log(tokens.refresh_token);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
  rl.close();
});
