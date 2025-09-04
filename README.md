# WorkTime Buddy - Chrome Extension

A production-ready Chrome Extension MV3 that helps you track your working hours with smart notifications and overtime detection.

## Features

### Core Functionality
- ⏰ **Time Tracking**: Input start time, required hours, and lunch break window
- 📊 **Real-time Display**: Shows worked time, remaining time, and calculated end time
- 🚨 **Smart Notifications**: Pre-leave reminders, end-time alerts, and lunch break notifications
- 🏷️ **Badge Updates**: Extension icon shows minutes remaining or "OT" for overtime
- 💾 **Persistent State**: All data persists across browser restarts using `chrome.storage.sync`

### Advanced Features
- 🌍 **Internationalization**: Full support for English and Vietnamese
- 🎨 **Theme Support**: Light and dark themes
- ⚙️ **Comprehensive Settings**: Customizable working hours, notification preferences, working days, and holidays
- 📱 **Responsive Design**: Works perfectly on different screen sizes
- 🔔 **Chrome Alarms**: Uses `chrome.alarms` for precise timing
- 📤 **Data Management**: Export/import settings and reset functionality

## Installation

### Development Installation
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project folder
5. The WorkTime Buddy extension will appear in your extensions list

### Production Installation
1. Package the extension (zip all files except `node_modules` and development files)
2. Upload to Chrome Web Store for distribution

## Usage

### Basic Workflow
1. **Start Work**: Click "Start Work" to begin tracking your work day
2. **Lunch Break**: Use "Start Lunch" and "End Lunch" buttons to track breaks
3. **End Work**: Click "End Work" when your day is complete
4. **Monitor Progress**: Watch the real-time display of worked time and remaining time

### Notifications
- **Pre-leave Reminder**: Get notified 10 minutes (configurable) before your work day ends
- **End Time Alert**: Notification when your scheduled work day is over
- **Lunch Reminder**: Get reminded to return from lunch break

### Badge Display
The extension icon badge shows:
- Minutes remaining until end time
- "OT" when in overtime mode
- Empty when not working

## Configuration

### Accessing Settings
Click the "Options" button in the popup or right-click the extension icon and select "Options"

### Available Settings

#### General Settings
- **Required Working Hours**: Default number of hours to work per day (default: 8)
- **Pre-leave Reminder**: Minutes before end time to show reminder (default: 10)
- **Language**: Choose between English and Vietnamese
- **Theme**: Light or dark theme

#### Notification Settings
- **Pre-leave Notification**: Enable/disable pre-leave reminders
- **End Time Notification**: Enable/disable end time alerts
- **Lunch End Notification**: Enable/disable lunch break reminders

#### Badge Settings
- **Display Mode**: Choose what to show on the badge
  - Minutes remaining
  - Hours remaining
  - Percentage complete
  - No badge

#### Working Days
Select which days of the week you typically work (default: Monday-Friday)

#### Holidays
Add specific dates when you don't work (holidays, vacation days, etc.)

#### Data Management
- **Export Settings**: Download your settings as a JSON file
- **Import Settings**: Upload previously exported settings
- **Reset All Data**: Clear all settings and return to defaults

## Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension manifest format
- **Service Worker**: Background script handles alarms and notifications
- **Vanilla JavaScript**: No frameworks, pure JavaScript for maximum compatibility
- **Chrome APIs**: Utilizes `chrome.storage`, `chrome.alarms`, `chrome.notifications`

### File Structure
```
worktime-buddy/
├── manifest.json          # Extension manifest
├── popup.html             # Main popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── background.js          # Service worker
├── options.html           # Settings page
├── options.css            # Settings styling
├── options.js             # Settings functionality
├── i18n.js                # Internationalization
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

### Permissions
- `storage`: For saving settings and work state
- `alarms`: For scheduling notifications
- `notifications`: For displaying alerts
- `activeTab`: For potential future features

### Browser Compatibility
- Chrome 88+ (Manifest V3 support required)
- Other Chromium-based browsers (Edge, Brave, etc.)

## Development

### Prerequisites
- Chrome browser with developer mode enabled
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the WorkTime Buddy extension
4. Test your changes

### Building for Production
1. Remove development files (`create-icons.js`, `generate-icons.html`)
2. Ensure all icon files are properly generated
3. Test thoroughly in a clean Chrome profile
4. Package as a ZIP file for Chrome Web Store submission

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, feature requests, or questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include browser version and extension version

## Changelog

### Version 1.0.0
- Initial release
- Core time tracking functionality
- Notification system
- Internationalization support
- Comprehensive settings page
- Theme support
- Data export/import

## Future Enhancements

- [ ] Weekly/monthly time reports
- [ ] Integration with calendar apps
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Custom notification sounds
- [ ] Keyboard shortcuts
- [ ] Offline mode improvements

---

**WorkTime Buddy** - Making work time tracking simple and effective! 🚀
