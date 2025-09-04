# Byterover Handbook

Generated: 2025-09-04

## Layer 1: System Overview

- Purpose: Chrome Extension (MV3) to track working hours with smart notifications, including pre-leave and end-time alerts, plus lunch reminders.
- Tech Stack: JavaScript (ES modules), Chrome MV3 APIs (`chrome.alarms`, `chrome.notifications`, `chrome.storage`, `chrome.action`), HTML/CSS.
- Architecture: MV3 background service worker (`background.js`) for timing/notifications; popup UI (`popup.html/js`) for session control and local scheduling; options page (`options.html/js`) for sync settings; shared i18n utilities.
- Entry Points: `background.js` (service_worker), `popup.html`/`popup.js`, `options.html`/`options.js`, `manifest.json`.

---

## Layer 2: Module Map

- Core Modules:
  - Background Service Worker: schedules and handles alarms; shows notifications; reacts to messages.
  - Popup UI: start/end work; calculates end time; sets alarms; updates badge.
  - Options Page: manages user settings (required hours, pre-leave minutes, language, notification toggles).
  - i18n Utilities: localized strings and helpers for UI and background notifications.

- Data Layer:
  - `chrome.storage.sync`: user settings (requiredHours, preLeaveMinutes, language, notifications flags).
  - `chrome.storage.local`: session state (isWorking, startTime, endTime, requiredHours).

- Integration Points:
  - Messaging: `chrome.runtime.sendMessage` actions (`setAlarm`, `clearAlarms`, `workStarted`, `workEnded`, `testNotification`, lunch events).
  - Alarms: `chrome.alarms` names `preLeave`, `endTime`, `lunchEnd`.
  - Notifications: `chrome.notifications.create`, listeners for click and button clicks.

---

## Layer 3: Integration Guide

- API Endpoints (Chrome APIs):
  - Alarms: create via `chrome.alarms.create(name, { when })`; handle via `chrome.alarms.onAlarm`.
  - Notifications: `chrome.notifications.create(id, options)`; listen via `onClicked` and `onButtonClicked`.
  - Storage: `chrome.storage.sync` (settings) and `chrome.storage.local` (state).

- Configuration Files:
  - `manifest.json`: declares permissions (`alarms`, `notifications`, `storage`), background `service_worker`, default popup/options.

- External Integrations:
  - None beyond Chrome APIs.

- Workflows:
  - Start Work: popup sends `workStarted` with ISO start time → background schedules `preLeave` and `endTime` alarms.
  - End Time Alarm: background `onAlarm('endTime')` → `showEndTimeNotification()`.
  - Pre-Leave/Lunch: analogous with `preLeave`/`lunchEnd`.

---

## Layer 4: Extension Points

- Design Patterns: message-passing between popup and background; time calculations centralized per view; i18n via simple dictionary.
- Extension Points: add new alarm types, enrich notification actions, persist session history, integrate calendars/holidays.
- Customization Areas: options for notification toggles, required hours, pre-leave minutes, theme, language.

---

## Quality Validation Checklist

- [x] System Overview completed
- [x] Module Map completed
- [x] Integration Guide completed
- [x] Extension Points completed
- [x] Tech stack and permissions documented

