import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "OK" : "FALTA");
console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "OK" : "FALTA");
console.log("REFRESH_TOKEN:", process.env.GOOGLE_REFRESH_TOKEN ? "OK" : "FALTA");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

async function testToken() {
  try {
    const token = await oAuth2Client.getAccessToken();
    console.log("✅ Token válido:", token.token || token);
  } catch (err) {
    console.error("❌ Error al obtener token:");
    console.error(err.response?.data || err.message);
  }
}

testToken();
