# 📱 Life Tracker App

A comprehensive Progressive Web App (PWA) to track all aspects of your life - Personal, Health, and Professional.

## ✨ Features

### 👤 Personal Tracking
- **Education**: Track your educational progress and milestones
- **Visa Process**: Monitor visa application steps and deadlines
- **Driving License**: Keep track of license-related tasks
- **Custom Categories**: Add unlimited custom categories with subdivisions

### 💪 Health Tracking
- **Daily Habits**: 
  - Track waking up on time
  - Monitor water intake (8 glasses goal)
  - Ensure eating at least one vegetable daily
- **Health Notes**: Keep detailed health records with dates

### 💼 Professional Tracking
- **School Tasks**: Manage all school-related work
- **Video Creation**: Track video projects from start to finish
- **Family Updates**: Keep family information current
- **Website Management**: Track website update tasks
- **Social Media**: Plan and track posts across platforms
- **Lesson Plans**: Create and organize lesson plans for Grade 7, 8, and 9
- **Schedule Reminders**: Set time-based pop-up notifications
  - One-time reminders
  - Daily recurring reminders
  - Weekly recurring reminders
  - Monthly recurring reminders

## 🚀 Quick Start

### Files Included
1. `life-tracker.html` - Main application
2. `app.js` - Application logic
3. `service-worker.js` - Offline support and notifications
4. `manifest.json` - PWA configuration
5. `icon-generator.html` - Tool to create app icons
6. `SETUP-GUIDE.md` - Detailed setup instructions

### Installation Steps

1. **Create Icons**
   - Open `icon-generator.html` in your browser
   - Customize your icon
   - Download both 192x192 and 512x512 icons
   - Save them in your app folder

2. **Set Up Google Drive** (Optional but Recommended)
   - Create a Google Cloud Project
   - Enable Google Drive API
   - Get Client ID and API Key
   - Update credentials in `app.js`
   - See SETUP-GUIDE.md for detailed instructions

3. **Host Your App**
   - **Local Testing**: Use Python HTTP server
     ```bash
     python -m http.server 8080
     ```
   - **Free Hosting**: Deploy to Netlify, Vercel, or GitHub Pages
   - See SETUP-GUIDE.md for detailed instructions

4. **Install on Phone**
   - **Android**: Chrome > Menu > "Add to Home Screen"
   - **iPhone**: Safari > Share > "Add to Home Screen"

5. **Enable Notifications**
   - Open the app
   - Click "🔔 Enable Notifications"
   - Allow when prompted

## 📋 Usage Guide

### Adding Items
1. Navigate to the relevant tab (Personal/Health/Professional)
2. Find the section you want to add to
3. Click the "+ Add" button
4. Fill in the form
5. Click "Add"

### Checking Off Tasks
- Click the checkbox next to any task to mark it complete
- Completed tasks show with a strikethrough
- Health habits reset daily

### Setting Reminders
1. Go to Professional Tab
2. Scroll to "Schedule Reminders"
3. Click "+ Add Reminder"
4. Set:
   - Title and details
   - Date and time
   - Repeat frequency
5. You'll receive a notification at the scheduled time

### Syncing with Google Drive
1. Click "☁️ Sync with Google Drive"
2. Sign in to your Google account
3. Your data is backed up automatically
4. Sync regularly for data safety

### Subdivisions and Organization
- Each main category supports unlimited items
- Add custom categories for anything not covered
- Use descriptive titles for easy searching
- Group related items together

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Structure
- **CSS3** - Styling with gradient backgrounds
- **JavaScript** - Application logic
- **Service Worker** - Offline support and notifications
- **Google Drive API** - Cloud backup
- **Local Storage** - Data persistence

### Browser Support
- Chrome (Recommended)
- Safari
- Firefox
- Edge
- Opera

### Mobile Support
- Android 5.0+
- iOS 11.3+

## 📱 PWA Features

- **Installable**: Add to home screen like a native app
- **Offline Support**: Works without internet connection
- **Push Notifications**: Receive reminders even when app is closed
- **Responsive**: Works on all screen sizes
- **Fast**: Loads instantly from cache

## 🔒 Privacy & Security

- All data stored locally on your device
- Google Drive sync is optional and encrypted
- No third-party tracking
- No data collection
- You own your data completely

## 💾 Data Backup

Your data is stored in multiple places:

1. **Browser Local Storage** (Primary)
   - Automatic
   - Instant access
   - Persists until you clear browser data

2. **Google Drive** (Backup)
   - Manual sync
   - Accessible from any device
   - Additional security

3. **Service Worker Cache** (Offline)
   - Automatic
   - Enables offline functionality
   - Updates automatically

## 🎨 Customization

### Colors
Edit `life-tracker.html` CSS section:
- Main gradient: Lines 14-15
- Primary color: #667eea
- Secondary color: #764ba2
- Replace with your preferred colors

### Icons
- Use `icon-generator.html` to create custom icons
- Or create your own 192x192 and 512x512 PNG files

### Categories
- Add custom sections by editing the HTML
- Modify forms in the modal section
- Update JavaScript to handle new data types

## 🐛 Troubleshooting

### Notifications Not Working?
- Check browser notification permissions
- Ensure notifications are enabled in app
- On mobile, check system notification settings

### Data Not Saving?
- Check browser local storage isn't full
- Don't use incognito/private mode
- Ensure JavaScript is enabled

### Google Drive Sync Failing?
- Verify Client ID and API Key are correct
- Check internet connection
- Sign out and sign back in to Google

### App Won't Install on Phone?
- Use Chrome (Android) or Safari (iPhone)
- Clear browser cache
- Ensure all files are in the same folder

## 📚 Additional Resources

- **SETUP-GUIDE.md**: Detailed setup instructions
- **icon-generator.html**: Create custom app icons
- **Google Cloud Console**: https://console.cloud.google.com/
- **Netlify**: https://www.netlify.com/
- **Vercel**: https://vercel.com/

## 🆘 Support

For issues or questions:
1. Read SETUP-GUIDE.md thoroughly
2. Check troubleshooting section
3. Verify all files are present and in the same folder
4. Ensure Google credentials are correct (if using sync)

## 📄 License

Free to use and modify for personal use.

## 🙏 Credits

Built with modern web technologies to help you stay organized and productive.

---

**Start tracking your life today! 🎉**

Open `life-tracker.html` in your browser to get started.
