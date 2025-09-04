// WorkTime Buddy - Background Script (Service Worker)
class WorkTimeBackground {
    constructor() {
        this.init();
    }

    init() {
        this.setupMessageListener();
        this.setupAlarmListener();
        this.setupNotificationClickListener();
        this.setupInstallListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'setAlarm':
                    this.setAlarm(request.name, request.when);
                    break;
                case 'clearAlarms':
                    this.clearAlarms();
                    break;
                case 'workStarted':
                    this.handleWorkStarted(request.startTime);
                    break;
                case 'workEnded':
                    this.handleWorkEnded();
                    break;
                case 'lunchStarted':
                    this.handleLunchStarted();
                    break;
                case 'lunchEnded':
                    this.handleLunchEnded();
                    break;
            }
            sendResponse({ success: true });
        });
    }

    setupAlarmListener() {
        chrome.alarms.onAlarm.addListener((alarm) => {
            this.handleAlarm(alarm);
        });
    }

    setupNotificationClickListener() {
        chrome.notifications.onClicked.addListener((notificationId) => {
            this.handleNotificationClick(notificationId);
        });
    }

    setupInstallListener() {
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.setDefaultSettings();
            }
        });
    }

    async setDefaultSettings() {
        const defaultSettings = {
            requiredHours: 8,
            preLeaveMinutes: 10,
            theme: 'light',
            language: 'en',
            badgeMode: 'minutes',
            weekdays: [1, 2, 3, 4, 5], // Monday to Friday
            holidays: [],
            notifications: {
                preLeave: true,
                endTime: true,
                lunchEnd: true
            }
        };

        try {
            await chrome.storage.sync.set(defaultSettings);
        } catch (error) {
            console.error('Error setting default settings:', error);
        }
    }

    async setAlarm(name, when) {
        try {
            await chrome.alarms.create(name, { when });
            console.log(`Alarm '${name}' set for ${new Date(when).toLocaleString()}`);
        } catch (error) {
            console.error('Error setting alarm:', error);
        }
    }

    async clearAlarms() {
        try {
            await chrome.alarms.clearAll();
            console.log('All alarms cleared');
        } catch (error) {
            console.error('Error clearing alarms:', error);
        }
    }

    async handleAlarm(alarm) {
        console.log('Alarm triggered:', alarm.name);

        switch (alarm.name) {
            case 'preLeave':
                await this.showPreLeaveNotification();
                break;
            case 'endTime':
                await this.showEndTimeNotification();
                break;
            case 'lunchEnd':
                await this.showLunchEndNotification();
                break;
        }
    }

        async showPreLeaveNotification() {
        const settings = await this.getSettings();

        if (!settings.notifications.preLeave) return;

        // Get localized messages
        const title = await this.getLocalizedMessage('notif.preLeave.title');
        const message = await this.getLocalizedMessage('notif.preLeave.msg', { minutes: settings.preLeaveMinutes });

        const notificationOptions = {
            type: 'basic',
            iconUrl: 'icons/clock.png',
            title: title,
            message: message,
            buttons: [
                { title: 'End Work Now' },
                { title: 'Dismiss' }
            ],
            priority: 1
        };

        try {
            await chrome.notifications.create('preLeave', notificationOptions);
        } catch (error) {
            console.error('Error showing pre-leave notification:', error);
        }
    }

        async showEndTimeNotification() {
        const settings = await this.getSettings();

        if (!settings.notifications.endTime) return;

        // Get localized messages
        const title = await this.getLocalizedMessage('notif.leaveNow.title');
        const message = await this.getLocalizedMessage('notif.leaveNow.msg');

        const notificationOptions = {
            type: 'basic',
            iconUrl: 'icons/clock.png',
            title: title,
            message: message,
            buttons: [
                { title: 'End Work' },
                { title: 'Continue (Overtime)' }
            ],
            priority: 2
        };

        try {
            await chrome.notifications.create('endTime', notificationOptions);
        } catch (error) {
            console.error('Error showing end time notification:', error);
        }
    }

        async showLunchEndNotification() {
        const settings = await this.getSettings();

        if (!settings.notifications.lunchEnd) return;

        // Get localized messages
        const title = await this.getLocalizedMessage('notif.backFromLunch.title');
        const message = await this.getLocalizedMessage('notif.backFromLunch.msg');

        const notificationOptions = {
            type: 'basic',
            iconUrl: 'icons/clock.png',
            title: title,
            message: message,
            buttons: [
                { title: 'End Lunch' },
                { title: 'Dismiss' }
            ],
            priority: 1
        };

        try {
            await chrome.notifications.create('lunchEnd', notificationOptions);
        } catch (error) {
            console.error('Error showing lunch end notification:', error);
        }
    }

    async handleNotificationClick(notificationId) {
        // Handle notification button clicks
        chrome.notifications.onButtonClicked.addListener(async (notifId, buttonIndex) => {
            if (notifId === notificationId) {
                switch (notificationId) {
                    case 'preLeave':
                        if (buttonIndex === 0) {
                            // End work now
                            await this.endWorkFromNotification();
                        }
                        break;
                    case 'endTime':
                        if (buttonIndex === 0) {
                            // End work
                            await this.endWorkFromNotification();
                        } else if (buttonIndex === 1) {
                            // Continue overtime
                            await this.continueOvertime();
                        }
                        break;
                    case 'lunchEnd':
                        if (buttonIndex === 0) {
                            // End lunch
                            await this.endLunchFromNotification();
                        }
                        break;
                }

                // Clear the notification
                chrome.notifications.clear(notificationId);
            }
        });
    }

    async endWorkFromNotification() {
        try {
            // Update state
            await chrome.storage.local.set({
                isWorking: false,
                isOnLunch: false
            });

            // Clear alarms
            await this.clearAlarms();

            // Update badge
            chrome.action.setBadgeText({ text: '' });

            // Show confirmation
            await chrome.notifications.create('workEnded', {
                type: 'basic',
                iconUrl: 'icons/clock.png',
                title: 'WorkTime Buddy',
                message: 'Work session ended! Have a great rest of your day! 🌟',
                priority: 1
            });

        } catch (error) {
            console.error('Error ending work from notification:', error);
        }
    }

    async continueOvertime() {
        try {
            // Show overtime notification
            await chrome.notifications.create('overtime', {
                type: 'basic',
                iconUrl: 'icons/clock.png',
                title: 'WorkTime Buddy',
                message: 'Continuing in overtime mode. Remember to take breaks! ⚠️',
                priority: 1
            });

        } catch (error) {
            console.error('Error continuing overtime:', error);
        }
    }

    async endLunchFromNotification() {
        try {
            // Update state
            await chrome.storage.local.set({
                isOnLunch: false,
                lunchEndTime: new Date().toISOString()
            });

            // Update badge
            await this.updateBadgeFromBackground();

        } catch (error) {
            console.error('Error ending lunch from notification:', error);
        }
    }

    async handleWorkStarted(startTime) {
        console.log('Work started at:', startTime);

        // Set up initial alarms
        const start = new Date(startTime);
        const settings = await this.getSettings();
        const endTime = new Date(start.getTime() + (settings.requiredHours * 60 * 60 * 1000));
        const preLeaveTime = new Date(endTime.getTime() - (settings.preLeaveMinutes * 60 * 1000));

        await this.setAlarm('preLeave', preLeaveTime.getTime());
        await this.setAlarm('endTime', endTime.getTime());
    }

    async handleWorkEnded() {
        console.log('Work ended');
        await this.clearAlarms();
        chrome.action.setBadgeText({ text: '' });
    }

    async handleLunchStarted() {
        console.log('Lunch started');

        // Set lunch end alarm (assuming 1 hour lunch)
        const lunchEndTime = new Date(Date.now() + (60 * 60 * 1000));
        await this.setAlarm('lunchEnd', lunchEndTime.getTime());
    }

    async handleLunchEnded() {
        console.log('Lunch ended');

        // Clear lunch alarm
        await chrome.alarms.clear('lunchEnd');
    }

        async getSettings() {
        try {
            const result = await chrome.storage.sync.get([
                'requiredHours', 'preLeaveMinutes', 'notifications', 'language'
            ]);

            return {
                requiredHours: result.requiredHours || 8,
                preLeaveMinutes: result.preLeaveMinutes || 10,
                language: result.language || 'en',
                notifications: result.notifications || {
                    preLeave: true,
                    endTime: true,
                    lunchEnd: true
                }
            };
        } catch (error) {
            console.error('Error getting settings:', error);
            return {
                requiredHours: 8,
                preLeaveMinutes: 10,
                language: 'en',
                notifications: {
                    preLeave: true,
                    endTime: true,
                    lunchEnd: true
                }
            };
        }
    }

    async getLocalizedMessage(key, replacements = {}) {
        try {
            const settings = await this.getSettings();
            const language = settings.language || 'en';

            // Simple translation dictionary for background script
            const translations = {
                en: {
                    'notif.preLeave.title': 'WorkTime Buddy',
                    'notif.preLeave.msg': 'You have {minutes} minutes left before your work day ends!',
                    'notif.leaveNow.title': 'WorkTime Buddy',
                    'notif.leaveNow.msg': 'Your work day is over! Time to go home! 🏠',
                    'notif.backFromLunch.title': 'WorkTime Buddy',
                    'notif.backFromLunch.msg': 'Welcome back from lunch! Time to get back to work! 💼',
                    'notif.workEnded.title': 'WorkTime Buddy',
                    'notif.workEnded.msg': 'Work session ended! Have a great rest of your day! 🌟',
                    'notif.overtime.title': 'WorkTime Buddy',
                    'notif.overtime.msg': 'Continuing in overtime mode. Remember to take breaks! ⚠️'
                },
                vi: {
                    'notif.preLeave.title': 'WorkTime Buddy',
                    'notif.preLeave.msg': 'Bạn còn {minutes} phút nữa là hết giờ làm việc!',
                    'notif.leaveNow.title': 'WorkTime Buddy',
                    'notif.leaveNow.msg': 'Hết giờ làm việc rồi! Đến giờ về nhà! 🏠',
                    'notif.backFromLunch.title': 'WorkTime Buddy',
                    'notif.backFromLunch.msg': 'Chào mừng bạn quay lại sau giờ nghỉ trưa! Đến giờ làm việc! 💼',
                    'notif.workEnded.title': 'WorkTime Buddy',
                    'notif.workEnded.msg': 'Kết thúc ca làm việc! Chúc bạn có thời gian nghỉ ngơi tuyệt vời! 🌟',
                    'notif.overtime.title': 'WorkTime Buddy',
                    'notif.overtime.msg': 'Tiếp tục chế độ tăng ca. Nhớ nghỉ giải lao nhé! ⚠️'
                }
            };

            let message = translations[language]?.[key] || translations['en']?.[key] || key;

            // Replace placeholders
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`{${placeholder}}`, 'g');
                message = message.replace(regex, replacements[placeholder]);
            });

            return message;
        } catch (error) {
            console.error('Error getting localized message:', error);
            return key;
        }
    }

    async updateBadgeFromBackground() {
        try {
            const state = await chrome.storage.local.get([
                'isWorking', 'startTime', 'requiredHours', 'lunchStartTime', 'lunchEndTime'
            ]);

            if (!state.isWorking || !state.startTime) {
                chrome.action.setBadgeText({ text: '' });
                return;
            }

            const startTime = new Date(state.startTime);
            const now = new Date();

            // Calculate total time needed (work hours + lunch break)
            let totalTimeNeeded = state.requiredHours;

            // Add lunch time if taken
            if (state.lunchStartTime && state.lunchEndTime) {
                const lunchDuration = (new Date(state.lunchEndTime) - new Date(state.lunchStartTime)) / (1000 * 60 * 60);
                totalTimeNeeded += lunchDuration;
            }

            const endTime = new Date(startTime.getTime() + (totalTimeNeeded * 60 * 60 * 1000));

            const remainingTime = endTime - now;

            if (remainingTime <= 0) {
                chrome.action.setBadgeText({ text: 'OT' });
                chrome.action.setBadgeBackgroundColor({ color: '#ff4444' });
            } else {
                const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));
                chrome.action.setBadgeText({ text: remainingMinutes.toString() });
                chrome.action.setBadgeBackgroundColor({ color: '#4facfe' });
            }

        } catch (error) {
            console.error('Error updating badge from background:', error);
        }
    }
}

// Initialize background script
new WorkTimeBackground();
