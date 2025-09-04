# WorkTime Buddy - Chrome Extension

A production-ready Chrome Extension MV3 that helps you track your working hours with smart notifications, micro-break reminders, and overtime detection.

## Features

### Core Functionality
- ⏰ **Time Tracking**: Input start time, required hours, and lunch break window
- 📊 **Real-time Display**: Shows worked time, remaining time, and calculated end time
- 🚨 **Smart Notifications**: Pre-leave reminders, end-time alerts, lunch return, and optional micro-break reminders
- 🏷️ **Badge Updates**: Extension icon shows minutes remaining or "OT" for overtime
- 💾 **Persistent State**: All data persists across browser restarts using `chrome.storage.sync`

### Advanced Features
- 🌍 **Internationalization**: Full support for English and Vietnamese
- 🎨 **Theme Support**: Light and dark themes
- 🔔 **Notification Styles**: Choose Compact or Rich (Rich adds action buttons)
- 🗣️ **TTS Option**: Optional text-to-speech announcement for end time (Chrome TTS)
- 🧘 **Micro-breaks**: Optional reminders every N minutes (e.g., 60–90) to stretch and rest
- ⚙️ **Comprehensive Settings**: Customizable working hours, notification preferences, working days, holidays, badge mode
- 📱 **Responsive Design**: Works perfectly on different screen sizes
- ⏱️ **Chrome Alarms**: Uses `chrome.alarms` for precise timing
- 📤 **Data Management**: Export/import settings and reset functionality

## Installation

### Development Installation
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project folder (or `dist/` after building)
5. The WorkTime Buddy extension will appear in your extensions list

### Production Installation
1. Run the build script (bundles + minifies, produces a zip):
   - `node build.js`
2. Load `dist/` as unpacked for testing, or upload `dist/worktime-buddy.zip` to Chrome Web Store

## Usage

### Basic Workflow
1. **Start Work**: Click "Start Work" in popup to begin a session
2. **Lunch Break**: Optionally configure your lunch window; background can remind you to return
3. **Micro-breaks (optional)**: If enabled, you’ll receive periodic stretch reminders while working
4. **End Work**: Click "End Work" when your day is complete (or via notification button)
5. **Monitor Progress**: Watch the real-time display of worked time and remaining time

### Notifications
- **Pre-leave Reminder**: Get notified X minutes (configurable) before your end time
- **End Time Alert**: Notification when your scheduled work day is over
- **Lunch Reminder**: Get reminded to return from lunch break
- **Micro-break Reminder (optional)**: Short reminder every N minutes during working sessions
- **Notification Style**: Compact (no buttons) or Rich (buttons like End Work, Continue OT, Snooze)
- **TTS (optional)**: Speaks the end-time message using Chrome TTS when enabled

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
- **Notification Style**: Select `Compact` or `Rich`
- **Speak End Time (TTS)**: Enable optional voice announcement for end time

#### Micro-breaks
- **Enable Micro-breaks**: Turn on/off periodic break reminders
- **Interval (minutes)**: Set interval, e.g., 60–90 minutes

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
- **Service Worker**: `background.js` handles alarms, notifications, and actions
- **Popup**: `popup.html` + `popup.js` for session control and live status
- **Options**: `options.html` + `options.js` for settings management
- **Internationalization**: `lib/i18n.js` for UI translations (EN/VI)
- **Chrome APIs**: `chrome.storage`, `chrome.alarms`, `chrome.notifications`, `chrome.tts` (optional)

### File Structure
```
worktime-buddy/
├── manifest.json           # Extension manifest (permissions include storage, alarms, notifications, tts)
├── background.js           # Service worker (alarms, notifications, TTS)
├── popup.html              # Main popup interface
├── popup.js                # Popup functionality
├── options.html            # Settings page
├── options.js              # Settings functionality
├── styles/                 # CSS assets
│   ├── md3.css             # Material-like base styles
│   ├── popup.css           # Popup styling
│   └── options.css         # Options styling
├── lib/
│   └── i18n.js             # Internationalization (EN/VI)
├── build.js                # Build script (bundles/minifies JS, minifies CSS, zips dist)
├── dist/                   # Build output (created by build)
└── README.md               # This file
```

### Permissions
- `storage`: For saving settings and work state
- `alarms`: For scheduling notifications
- `notifications`: For displaying alerts
- `tts`: For optional text-to-speech end-time announcement
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
2. Run `node build.js` to bundle/minify into `dist/` (esbuild auto-installs on first run)
3. Go to `chrome://extensions/`
4. Load unpacked from `dist/` or click refresh on the loaded unpacked extension
5. Test your changes

### Building for Production
1. Run `node build.js` (bundles JS, minifies CSS, creates `dist/worktime-buddy.zip`)
2. Test thoroughly using `dist/` in a clean Chrome profile
3. Upload the generated ZIP to Chrome Web Store

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

### Version 1.1.0
- Reliability improvements for end-time notifications (listener handling)
- Added micro-break reminders (configurable interval)
- Added notification styles (Compact vs Rich)
- Added optional TTS for end-time announcement (requires `tts` permission)
- Moved CSS to `styles/` and added build-time CSS minification
- Build pipeline with esbuild: bundle/minify JS, zip artifact

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
