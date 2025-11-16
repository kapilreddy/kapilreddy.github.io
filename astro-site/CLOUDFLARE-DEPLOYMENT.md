# Cloudflare Pages Deployment Guide

This Astro site is configured for deployment on Cloudflare Pages with SSR (Server-Side Rendering) support.

## Configuration Files

- **astro.config.mjs**: Configured with `@astrojs/cloudflare` adapter and `output: 'server'`
- **wrangler.toml**: Cloudflare configuration with KV namespace bindings

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (optional, for local testing)
3. Git repository connected to Cloudflare Pages

## Deployment Options

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Connect Your Repository**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Pages → Create a project
   - Connect your GitHub/GitLab repository
   - Select this repository

2. **Configure Build Settings**
   - **Framework preset**: Astro
   - **Build command**: `yarn build` or `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `astro-site`

3. **Add Environment Variables** (if needed)
   - Set any required environment variables in the Cloudflare dashboard

4. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your site automatically

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler** (if not already installed)
   ```bash
   npm install -g wrangler
   # or
   yarn global add wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create KV Namespace**
   ```bash
   wrangler kv:namespace create SESSION
   ```
   Update the `id` in `wrangler.toml` with the returned namespace ID.

4. **Build the project**
   ```bash
   cd astro-site
   yarn build
   ```

5. **Deploy**
   ```bash
   wrangler pages deploy dist
   ```

## KV Namespace for Sessions

The project uses Cloudflare KV for session management. When deploying via the dashboard:

1. Go to Workers & Pages → KV
2. Create a new namespace called `SESSION`
3. In your Pages project settings, bind this KV namespace with the binding name `SESSION`

## Environment Variables

If you need to add environment variables:

1. Go to your Pages project in Cloudflare Dashboard
2. Settings → Environment variables
3. Add variables for both Production and Preview environments

## Custom Domain

To add a custom domain:

1. Go to your Pages project
2. Custom domains → Set up a custom domain
3. Follow the DNS configuration instructions

## Notes

- The site is configured with `output: 'server'` for SSR support
- Sharp image optimization is not available at runtime on Cloudflare
- Static assets are served from the `public/` directory
- The build generates a `_worker.js` file for Cloudflare Workers runtime

## Troubleshooting

### Build Failures

If the build fails, check:
- All dependencies are installed
- Build command is correct
- Node version compatibility (Cloudflare uses Node 18+)

### KV Binding Errors

If you see "Invalid binding `SESSION`" errors:
- Ensure the KV namespace is created
- Verify the binding name matches in wrangler.toml
- Check that the binding is added in Cloudflare Dashboard

## Local Development

To test the Cloudflare environment locally:

```bash
yarn build
wrangler pages dev dist
```

This will start a local server that simulates the Cloudflare Pages environment.
