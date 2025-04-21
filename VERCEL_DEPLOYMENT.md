# Deploying BiggerPockets Agent Finder to Vercel

This guide explains how to deploy the BiggerPockets Agent Finder widget to Vercel for improved cross-domain embedding capabilities.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Git repository with the project code

## Deployment Steps

### 1. Push your code to a Git repository

If you haven't already, push your code to a Git repository on GitHub, GitLab, or Bitbucket.

### 2. Import your project in Vercel

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Other
   - Build Command: (Leave as is - uses the one from vercel.json)
   - Output Directory: dist
   - Environment Variables: Add any required environment variables

### 3. Deploy your project

Click "Deploy" and wait for the deployment to complete.

### 4. Update Embedding Code

After deployment, your widget will be available at:
- `https://your-project-name.vercel.app/embed.js`

Update your embedding code to use the new Vercel URL:

```html
<script 
  src="https://your-project-name.vercel.app/embed.js" 
  data-containerid="bp-agent-finder"
  data-width="100%"
  data-height="700px"
  data-borderradius="8px"
  data-boxshadow="0 4px 12px rgba(0, 0, 0, 0.1)">
</script>
```

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `WEBHOOK_ENDPOINT_COMPLETE`: URL for complete form submissions
- `WEBHOOK_ENDPOINT_PARTIAL`: URL for partial form submissions (optional)
- `WEBHOOK_ENDPOINT_FAILURES`: URL for failure logging (optional)

## Troubleshooting

If you encounter embedding issues after deployment:

1. Check that Content-Security-Policy and X-Frame-Options headers are properly set
2. Verify CORS settings allow embedding from other domains
3. Test embedding on a different domain to ensure cross-domain functionality works

## Vercel-specific Configuration

The key configuration files for Vercel deployment are:

- `vercel.json`: Contains build configuration, routes, and header settings
- `api/index.ts`: API routes entry point
- `server/vercel.ts`: Server configuration for Vercel deployment

## Custom Domain (Optional)

For a more professional look, you can add a custom domain in your Vercel project settings.