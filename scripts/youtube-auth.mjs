#!/usr/bin/env node
/**
 * One-time YouTube OAuth flow.
 *
 * Reads `.youtube-credentials/client_secret.json`, opens the consent screen in
 * your browser, captures the auth code via a localhost callback, exchanges it
 * for a refresh token, and writes the result to `.youtube-credentials/token.json`.
 *
 * Run once per machine. After that, scripts/youtube-update.mjs reuses the
 * refresh token to mint short-lived access tokens automatically.
 *
 * Usage: node scripts/youtube-auth.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { URL } from "node:url";
import { google } from "googleapis";
import open from "open";

const CRED_PATH = ".youtube-credentials/client_secret.json";
const TOKEN_PATH = ".youtube-credentials/token.json";
const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];

if (!existsSync(CRED_PATH)) {
  console.error(`Missing ${CRED_PATH}. Download the Desktop OAuth client JSON from`);
  console.error(`Google Cloud Console (Clients page) and save it to that path.`);
  process.exit(1);
}

const { installed } = JSON.parse(readFileSync(CRED_PATH, "utf8"));
if (!installed) {
  console.error(`${CRED_PATH} is not a Desktop OAuth client (missing 'installed' key).`);
  process.exit(1);
}

const port = 8765;
const redirectUri = `http://localhost:${port}`;

const oauth2 = new google.auth.OAuth2(
  installed.client_id,
  installed.client_secret,
  redirectUri
);

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, redirectUri);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`OAuth error: ${error}`);
      console.error(`Consent denied or errored: ${error}`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing code");
      return;
    }

    const { tokens } = await oauth2.getToken(code);
    writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html><body style="font-family:system-ui;padding:40px;max-width:500px;margin:auto">
        <h2>Authorized.</h2>
        <p>Tokens saved to <code>${TOKEN_PATH}</code>. You can close this tab.</p>
      </body></html>
    `);
    console.log(`Tokens saved to ${TOKEN_PATH}`);
    if (!tokens.refresh_token) {
      console.warn(
        "WARNING: no refresh_token in response. This usually means you've " +
        "already authorized this client. Revoke at " +
        "https://myaccount.google.com/permissions and re-run."
      );
    }
    server.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error — see terminal");
    server.close();
    process.exit(1);
  }
});

server.listen(port, () => {
  console.log(`Listening on ${redirectUri}`);
  console.log(`Opening consent screen in your browser...`);
  console.log(`If it doesn't open automatically, visit:\n  ${authUrl}\n`);
  open(authUrl);
});
