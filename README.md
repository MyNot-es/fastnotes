# FastNotes

A real-time note-taking application built with React, Vite, and Firebase.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DB_URL=https://your_project.firebaseio.com
```

4. Run the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Connect your GitHub repository to Vercel
2. Add the environment variables from `.env.local` to your Vercel project settings
3. Deploy!
