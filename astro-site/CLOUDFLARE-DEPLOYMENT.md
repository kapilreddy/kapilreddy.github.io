# Cloudflare Pages Deployment Guide

This Astro site is configured for deployment on Cloudflare Pages with SSR (Server-Side Rendering) support.

## Configuration Files

- **astro.config.mjs**: Configured with `@astrojs/cloudflare` adapter and `output: 'server'`
- **wrangler.toml**: Minimal Cloudflare Pages configuration (project name and compatibility date only)

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

3. **Configure KV Namespace Binding** (Required for Sessions)
   - After creating the project, go to **Settings** → **Functions**
   - Scroll to **KV namespace bindings**
   - Click **Add binding**
   - **Variable name**: `SESSION`
   - **KV namespace**: Create a new namespace or select an existing one
   - Click **Save**

4. **Add Environment Variables** (if needed)
   - Set any required environment variables in the Cloudflare dashboard

5. **Deploy**
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

3. **Build the project**
   ```bash
   cd astro-site
   yarn build
   ```

4. **Deploy**
   ```bash
   wrangler pages deploy dist
   ```

   Note: When deploying via CLI, you'll still need to configure KV namespace bindings in the Cloudflare Dashboard as described in Option 1, step 3.

## KV Namespace for Sessions

The `@astrojs/cloudflare` adapter automatically enables session support using Cloudflare KV. To complete the setup:

1. **Create a KV Namespace**
   - Go to **Workers & Pages** → **KV**
   - Click **Create a namespace**
   - Name it something like `astro-sessions` or `SESSION`

2. **Bind the Namespace to Your Pages Project**
   - Go to your Pages project
   - Navigate to **Settings** → **Functions**
   - Under **KV namespace bindings**, click **Add binding**
   - **Variable name**: `SESSION` (this must match what the adapter expects)
   - **KV namespace**: Select the namespace you created
   - Click **Save**

**Important**: The binding variable name must be `SESSION` as this is what the Cloudflare adapter uses by default.

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
- Ensure the KV namespace is created in Cloudflare Dashboard
- Verify the binding name is exactly `SESSION` (case-sensitive)
- Check that the binding is added in **Settings** → **Functions** → **KV namespace bindings**
- For Pages deployments, KV bindings are configured in the Dashboard, not in wrangler.toml

### Configuration File Errors

If you see "Configuration file for Pages projects does not support 'site'" or similar errors:
- Ensure wrangler.toml only contains basic configuration (name and compatibility_date)
- For Pages deployments, advanced configuration (KV bindings, environment variables) is done via the Cloudflare Dashboard
- Commit and push your updated wrangler.toml to trigger a fresh deployment

## Local Development

To test the Cloudflare environment locally:

```bash
yarn build
wrangler pages dev dist
```

This will start a local server that simulates the Cloudflare Pages environment.
