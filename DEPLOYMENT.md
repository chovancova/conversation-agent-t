# Deployment Guide

This document provides detailed instructions for deploying the Multi-Agent Tester application to GitHub Pages.

## Overview

The application is configured to automatically deploy to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a build and deployment workflow.

## Prerequisites

- A GitHub account
- Repository access to `chovancova/conversation-agent-t`
- GitHub Pages enabled in repository settings

## One-Time Setup: Enable GitHub Pages

Follow these steps to enable GitHub Pages for your repository:

### Step 1: Access Repository Settings

1. Navigate to your repository on GitHub: `https://github.com/chovancova/conversation-agent-t`
2. Click on **Settings** (gear icon in the top navigation)

### Step 2: Configure GitHub Pages

1. In the left sidebar, scroll down and click on **Pages**
2. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** from the dropdown
   - This allows the custom workflow to deploy the site
3. Save the settings (if there's a save button)

### Step 3: Verify Workflow Permissions

1. In the left sidebar, click on **Actions** → **General**
2. Scroll down to **Workflow permissions**
3. Ensure that **Read and write permissions** is selected
4. Check the box for **Allow GitHub Actions to create and approve pull requests**
5. Click **Save** if you made any changes

## Deployment Process

### Automatic Deployment

Once GitHub Pages is enabled, the deployment process is fully automated:

1. **Trigger**: Push changes to the `main` branch
2. **Build**: GitHub Actions runs the build workflow defined in `.github/workflows/deploy.yml`
3. **Deploy**: The built site is automatically deployed to GitHub Pages
4. **Access**: Site becomes available at `https://chovancova.github.io/conversation-agent-t/`

### Manual Deployment

You can also trigger a deployment manually:

1. Go to **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select the `main` branch
5. Click **Run workflow**

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) performs the following steps:

1. **Checkout**: Clones the repository code
2. **Setup Node**: Installs Node.js 20
3. **Install Dependencies**: Runs `npm ci` to install packages
4. **Build**: Runs `npm run build` to create production build
5. **Upload Artifact**: Packages the `dist` folder
6. **Deploy**: Publishes to GitHub Pages

## Configuration Files

### Vite Configuration (`vite.config.ts`)

The Vite configuration includes:
- `base: '/conversation-agent-t/'` - Sets the base path for GitHub Pages
- Required for proper asset loading on GitHub Pages subdomain

### Public Files (`public/`)

- `.nojekyll` - Prevents Jekyll processing by GitHub Pages
- Ensures files with underscores are served correctly

## Verifying Deployment

After pushing to `main`, verify the deployment:

1. Go to **Actions** tab in your repository
2. Check the latest workflow run status
3. Click on the workflow to see detailed logs
4. Once completed successfully (green checkmark), visit your site
5. URL: `https://chovancova.github.io/conversation-agent-t/`

## Troubleshooting

### Deployment Fails

If the deployment fails:

1. Check the **Actions** tab for error messages
2. Common issues:
   - Build errors: Check the build logs
   - Permission errors: Verify workflow permissions
   - Missing dependencies: Ensure `package-lock.json` is committed

### Site Not Accessible

If the site doesn't load:

1. Verify GitHub Pages is enabled with source set to "GitHub Actions"
2. Check that the workflow completed successfully
3. Wait a few minutes - initial deployment can take time
4. Clear browser cache and try again

### Assets Not Loading

If the site loads but assets (CSS/JS) are missing:

1. Verify the `base` path in `vite.config.ts` matches your repository name
2. Check browser console for 404 errors
3. Ensure `.nojekyll` file exists in the `public` folder

## Local Testing

Before deploying, test the production build locally:

```bash
# Clean previous build
rm -rf dist

# Build for production
npm run build

# Preview the production build
npm run preview
```

This will serve the built site locally at `http://localhost:4173` (with the base path applied).

## Rollback

To rollback to a previous version:

1. Identify the commit hash of the working version
2. Create a new commit reverting to that state:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. The workflow will automatically deploy the reverted version

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)

## Security Note

The deployed site is publicly accessible. Ensure:
- No sensitive credentials are hardcoded
- All secrets are managed through the application's encrypted storage
- Users understand the security model (see [SECURITY.md](./SECURITY.md))
