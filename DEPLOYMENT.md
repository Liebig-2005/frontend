# Deployment Guide

## API Configuration

This project uses a dynamic API configuration system that automatically adapts to different environments.

### How It Works

The API configuration is handled in `src/config/api.js`:

- **Development**: Defaults to `http://localhost:8000` if no environment variable is set
- **Production**: Uses environment variable `REACT_APP_API_URL` or falls back to relative URLs (same origin)

### Setting Up for Deployment

#### Option 1: Environment Variable (Recommended)

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=https://your-backend-api.com
```

Or set it in your deployment platform:
- **Vercel**: Add in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Build & Deploy → Environment
- **Heroku**: Use `heroku config:set REACT_APP_API_URL=https://your-api.com`

#### Option 2: Same Origin (If frontend and backend are on the same domain)

If your frontend and backend are served from the same domain (e.g., using a reverse proxy), you can leave `REACT_APP_API_URL` unset. The app will automatically use relative URLs like `/api/chatbot/`.

### Building for Production

```bash
cd frontend
npm install
npm run build
```

The build process will:
- Use `REACT_APP_API_URL` if set
- Fall back to relative URLs if not set (for same-origin deployments)

### Testing Locally

For local development, the default `http://localhost:8000` is used. To test with a different URL:

```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start the app
npm start
```

### API Endpoints

The following endpoints are configured:
- Chatbot: `/api/chatbot/`
- Disease Scanner: `/api/scanner/`

These are automatically constructed from the base URL configuration.

