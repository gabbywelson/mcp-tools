# How to Get Your WHOOP Refresh Token

This guide walks you through obtaining a refresh token for the WHOOP MCP server.

## Prerequisites

- WHOOP account with active membership
- WHOOP Developer account at [developer.whoop.com](https://developer.whoop.com)
- Client ID and Client Secret from your WHOOP application

## Step-by-Step Instructions

### Step 1: Create Your Authorization URL

Replace the placeholders in this URL with your actual values:

```
https://api.prod.whoop.com/oauth/oauth2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=read:recovery%20read:cycles%20read:sleep%20read:workout%20read:profile%20read:body_measurement%20offline&state=YOUR_RANDOM_STATE
```

**Replace:**

- `YOUR_CLIENT_ID` - Your WHOOP application's Client ID
- `YOUR_REDIRECT_URI` - The redirect URI you configured in your WHOOP app (e.g., `http://localhost:3000/callback`)
- `YOUR_RANDOM_STATE` - A random string of at least 8 characters for security (e.g., `abc12345` or generate one with `openssl rand -hex 16`)

**Example:**

```
https://api.prod.whoop.com/oauth/oauth2/auth?response_type=code&client_id=abc123xyz&redirect_uri=http://localhost:3000/callback&scope=read:recovery%20read:cycles%20read:sleep%20read:workout%20read:profile%20read:body_measurement%20offline&state=randomstate123
```

**Note:** The `state` parameter is required for security (CSRF protection). It must be at least 8 characters long.

### Step 2: Authorize Your Application

1. Copy your authorization URL
2. Paste it into your web browser
3. Log in to your WHOOP account if prompted
4. Click "Authorize" to grant access to your application

### Step 3: Get the Authorization Code

After authorizing, you'll be redirected to your redirect URI with a `code` parameter:

```
http://localhost:3000/callback?code=def456abc789xyz
```

Copy the value after `code=` - this is your **authorization code**.

**Note:** This code expires quickly (usually within 10 minutes), so proceed to the next step immediately.

### Step 4: Exchange Code for Tokens

Use curl to exchange the authorization code for access and refresh tokens:

```bash
curl --request POST \
  --url https://api.prod.whoop.com/oauth/oauth2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=authorization_code' \
  --data-urlencode 'code=YOUR_AUTHORIZATION_CODE' \
  --data-urlencode 'client_id=YOUR_CLIENT_ID' \
  --data-urlencode 'client_secret=YOUR_CLIENT_SECRET' \
  --data-urlencode 'redirect_uri=YOUR_REDIRECT_URI'
```

**Replace:**

- `YOUR_AUTHORIZATION_CODE` - The code from Step 3
- `YOUR_CLIENT_ID` - Your WHOOP Client ID
- `YOUR_CLIENT_SECRET` - Your WHOOP Client Secret
- `YOUR_REDIRECT_URI` - Same redirect URI used in Step 1

### Step 5: Save Your Refresh Token

The response will look like this:

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def50200...",
  "scope": "read:recovery read:cycles read:sleep read:workout read:profile read:body_measurement%20offline"
}
```

**Save the `refresh_token` value** - this is what you'll use in your `.env` file!

### Step 6: Configure Your Environment

Add your credentials to `.env`:

```env
WHOOP_CLIENT_ID=your_client_id_here
WHOOP_CLIENT_SECRET=your_client_secret_here
WHOOP_REFRESH_TOKEN=your_refresh_token_here
```

## Alternative: Using Postman or Insomnia

If you prefer a GUI tool:

### Using Postman

1. Create a new request
2. Set method to POST
3. URL: `https://api.prod.whoop.com/oauth/oauth2/token`
4. Headers: `Content-Type: application/x-www-form-urlencoded`
5. Body (select "x-www-form-urlencoded"):
   - `grant_type`: `authorization_code`
   - `code`: `YOUR_AUTHORIZATION_CODE`
   - `client_id`: `YOUR_CLIENT_ID`
   - `client_secret`: `YOUR_CLIENT_SECRET`
   - `redirect_uri`: `YOUR_REDIRECT_URI`
6. Click Send
7. Copy the `refresh_token` from the response

## Troubleshooting

### "Invalid authorization code"

- The authorization code expires quickly (usually 10 minutes)
- Start over from Step 1 and complete all steps quickly

### "Invalid redirect_uri"

- The redirect URI must exactly match what you configured in your WHOOP app
- Include the protocol (http:// or https://)
- Check for trailing slashes

### "Invalid client credentials"

- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces or characters

### "Invalid scope"

- Ensure all required scopes are included in the authorization URL
- Scopes should be space-separated in the URL (encoded as `%20` or `+`)

## Required Scopes

Make sure your authorization includes these scopes:

- `read:recovery` - Recovery scores and metrics
- `read:cycles` - Daily strain and physiological cycles
- `read:sleep` - Sleep performance and stages
- `read:workout` - Workout activities and metrics
- `read:profile` - User profile information
- `read:body_measurement%20offline` - Body measurements

## Security Notes

- **Never commit** your refresh token to version control
- Store it securely in your `.env` file
- The `.env` file is already in `.gitignore`
- Refresh tokens don't expire but can be revoked
- You can revoke access anytime from the WHOOP Developer Portal

## Need Help?

- [WHOOP Developer Documentation](https://developer.whoop.com/docs)
- [WHOOP OAuth Guide](https://developer.whoop.com/docs/developing/oauth/)
- Open an issue on GitHub if you're still stuck
