# Life Tracker App - Complete Setup Guide

## 📱 Overview
This is a Progressive Web App (PWA) that helps you track:
- **Personal**: Education, Visa Process, Driving License, Custom Categories
- **Health**: Daily habits (waking up, drinking water, eating vegetables), health notes
- **Professional**: School tasks, video creation, family updates, website tasks, social media, lesson plans (G7, G8, G9), schedule reminders

## 🚀 Step-by-Step Setup Instructions

### Step 1: Get Your Files Ready
You now have these files:
1. `life-tracker.html` - Main app interface
2. `app.js` - App logic and functionality
3. `service-worker.js` - Offline support and notifications
4. `manifest.json` - PWA configuration

### Step 2: Create App Icons
Create two PNG icons for your app:
- **icon-192.png** (192x192 pixels)
- **icon-512.png** (512x512 pixels)

You can use free tools like:
- Canva.com (create a design, export as PNG)
- Remove.bg + any photo editor
- Or use an online icon generator

### Step 3: Set Up Google Drive Integration

#### A. Create a Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click "Create Project"
3. Name it "Life Tracker App"
4. Click "Create"

#### B. Enable Google Drive API
1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google Drive API"
3. Click "Enable"

#### C. Create Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure OAuth consent screen:
   - User Type: External
   - App name: Life Tracker
   - User support email: Your email
   - Developer contact: Your email
4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Life Tracker Web Client
   - Authorized JavaScript origins: 
     * http://localhost:8080
     * https://yourdomain.com (if you have one)
   - Authorized redirect URIs:
     * http://localhost:8080
     * https://yourdomain.com (if you have one)

#### D. Get Your Credentials
1. After creating, you'll see:
   - **Client ID**: Copy this (looks like: xxxxx.apps.googleusercontent.com)
   - **Client Secret**: You'll see this too (not needed for this app)

2. Also create an **API Key**:
   - Click "Create Credentials" > "API Key"
   - Copy the API key

#### E. Update app.js with Your Credentials
Open `app.js` and replace these lines (around line 28-29):

```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY_HERE';
```

Replace with your actual values:
```javascript
const CLIENT_ID = '123456789-abcdefg.apps.googleusercontent.com';  // Your Client ID
const API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX';  // Your API Key
```

### Step 4: Host Your App

#### Option A: Local Testing (Simplest)
1. Install Python (if not installed)
2. Open terminal/command prompt in your project folder
3. Run:
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```
4. Open browser: http://localhost:8080/life-tracker.html

#### Option B: Free Hosting (Recommended)

**Using Netlify (Easy & Free):**
1. Go to https://www.netlify.com/
2. Sign up with GitHub/Email
3. Drag and drop your folder
4. Your app is live! (You'll get a URL like: https://your-app.netlify.app)

**Using GitHub Pages:**
1. Create GitHub account
2. Create new repository named "life-tracker"
3. Upload all files
4. Go to Settings > Pages
5. Select "main" branch
6. Your app is live at: https://yourusername.github.io/life-tracker/

**Using Vercel:**
1. Go to https://vercel.com/
2. Sign up
3. Import your project
4. Deploy

### Step 5: Install on Your Phone

#### For Android:
1. Open Chrome on your phone
2. Go to your app URL
3. You'll see "Install App" prompt (or tap the menu > "Add to Home Screen")
4. Click "Install"
5. App appears on your home screen!

#### For iPhone:
1. Open Safari on your iPhone
2. Go to your app URL
3. Tap the Share button (box with arrow)
4. Scroll down and tap "Add to Home Screen"
5. Name it "Life Tracker" and tap "Add"

### Step 6: Enable Notifications

1. Open the app
2. Click "🔔 Enable Notifications" button
3. Allow notifications when prompted
4. Now you'll receive reminders!

### Step 7: Start Using the App

#### Personal Tab
- Track your education progress
- Monitor visa application steps
- Keep driving license information
- Add custom categories for anything else

#### Health Tab
- Check off daily habits (waking up, water, vegetables)
- Add health notes and tracking

#### Professional Tab
- Manage school tasks
- Track video creation projects
- Update family information
- Website maintenance tasks
- Social media planning
- Create lesson plans for Grade 7, 8, 9
- Set schedule reminders with pop-up notifications

## 📊 How to Use Features

### Adding Items
1. Click the "+ Add" button in any section
2. Fill in the details
3. Click "Add"

### Setting Reminders
1. Go to Professional Tab > Schedule Reminders
2. Click "+ Add Reminder"
3. Fill in:
   - Title
   - Details
   - Date and Time
   - Repeat frequency (Once/Daily/Weekly/Monthly)
4. You'll get a notification at the scheduled time!

### Syncing with Google Drive
1. Click "☁️ Sync with Google Drive" button
2. Sign in to your Google account
3. Allow permissions
4. Your data is backed up!
5. Sync regularly to keep a backup

### Subdivisions
- Click the dropdown arrows to expand/collapse sections
- Each main category can have unlimited items
- You can create custom categories for anything

## 🔧 Troubleshooting

### Notifications Not Working?
- Make sure you clicked "Enable Notifications"
- Check browser settings > Notifications > Allow for your app
- On Android: Settings > Apps > Chrome > Notifications > On

### Google Drive Not Syncing?
- Check your Client ID and API Key are correct in app.js
- Make sure you're signed in to Google
- Check internet connection

### App Not Installing on Phone?
- Make sure you're using Chrome (Android) or Safari (iPhone)
- Try clearing browser cache
- Make sure the manifest.json file is in the same folder

### Icons Not Showing?
- Make sure icon-192.png and icon-512.png are in the same folder
- Icons must be exactly 192x192 and 512x512 pixels

## 💾 Data Storage

Your data is stored in three places:
1. **Local Storage** (in your browser) - Automatic
2. **Google Drive** (when you sync) - Manual backup
3. **Service Worker Cache** (for offline use) - Automatic

## 📱 Using Offline

Once installed:
- App works without internet
- Data saves locally
- Sync with Google Drive when online
- Notifications work offline

## 🔒 Security & Privacy

- All data stored locally on your device
- Google Drive sync is optional
- Only you can access your data
- No third-party tracking

## 🎨 Customization

Want to customize colors? Edit the CSS in `life-tracker.html`:
- Background gradient: Line 14-15
- Main color: Change #667eea to your color
- Secondary color: Change #764ba2 to your color

## 📞 Support

If you need help:
1. Check this guide again
2. Try clearing browser cache and reloading
3. Make sure all files are in the same folder
4. Verify Google credentials are correct

## 🚀 Next Steps

1. Install on your phone
2. Enable notifications
3. Set up Google Drive sync
4. Start tracking your life!
5. Set your first reminder
6. Check off your health habits daily

---

**Enjoy staying organized with your Life Tracker App! 🎉**
