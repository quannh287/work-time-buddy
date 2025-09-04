// WorkTime Buddy - Internationalization (i18n) System
class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            en: {
                // App
                'app-title': 'WorkTime Buddy',
                'app-tooltip': 'WorkTime Buddy - Track your working hours',

                // UI Elements
                'today': 'Today',
                'startTime': 'Start Time',
                'lunchStart': 'Lunch Start',
                'lunchEnd': 'Lunch End',
                'requiredHours': 'Required Hours',
                'startNow': 'Start Now',
                'startLunch': 'Start Lunch',
                'endLunch': 'End Lunch',
                'resetToday': 'Reset Today',
                'endTime': 'End Time',
                'worked': 'Worked',
                'remaining': 'Remaining',
                'overtime': 'Overtime',

                // Status
                'status.normal': 'Normal',
                'status.lunch': 'On Lunch',
                'status.overtime': 'Overtime',
                'status.ready': 'Ready',
                'status.working': 'Working',
                'on-track': 'On track',
                'start-your-work-day': 'Start your work day',
                'enjoy-your-break': 'Enjoy your break',
                'keep-it-up': 'Keep it up!',
                'time-to-go-home': 'Time to go home!',

                // Options
                'settings': 'Settings',
                'save': 'Save',
                'resetDefaults': 'Reset to Defaults',
                'preLeaveNotifyMinutes': 'Pre-leave Notification (minutes)',
                'cancel': 'Cancel',
                'export-data': 'Export Settings',
                'import-data': 'Import Settings',
                'reset-data': 'Reset All Data',
                'add-holiday': 'Add Holiday',

                // Settings Categories
                'general-settings': 'General Settings',
                'notification-settings': 'Notification Settings',
                'badge-settings': 'Badge Settings',
                'working-days-settings': 'Working Days',
                'holidays-settings': 'Holidays',
                'data-management': 'Data Management',
                'language': 'Language',
                'theme': 'Theme',
                'badge-mode': 'Badge Display Mode',

                // Descriptions
                'required-hours-desc': 'Default number of hours you need to work per day',
                'pre-leave-desc': 'How many minutes before end time to show reminder',
                'language-desc': 'Interface language',
                'theme-desc': 'Visual theme for the extension',
                'badge-mode-desc': 'What to display on the extension icon badge',
                'working-days-desc': 'Select which days you typically work',
                'holidays-desc': 'Add holidays when you don\'t work',

                // Notifications
                'notif.preLeave.title': 'WorkTime Buddy',
                'notif.preLeave.msg': 'You have {minutes} minutes left before your work day ends!',
                'notif.leaveNow.title': 'WorkTime Buddy',
                'notif.leaveNow.msg': 'Your work day is over! Time to go home! 🏠',
                'notif.backFromLunch.title': 'WorkTime Buddy',
                'notif.backFromLunch.msg': 'Welcome back from lunch! Time to get back to work! 💼',
                'notif.workEnded.title': 'WorkTime Buddy',
                'notif.workEnded.msg': 'Work session ended! Have a great rest of your day! 🌟',
                'notif.overtime.title': 'WorkTime Buddy',
                'notif.overtime.msg': 'Continuing in overtime mode. Remember to take breaks! ⚠️',

                // Notification Settings
                'pre-leave-notification': 'Pre-leave reminder notification',
                'end-time-notification': 'End time notification',
                'lunch-end-notification': 'Back from lunch notification',
                'pre-leave-notification-desc': 'Get notified before your work day ends',
                'end-time-notification-desc': 'Get notified when your work day is over',
                'lunch-end-notification-desc': 'Get reminded to return from lunch break',

                // Badge Modes
                'badge-minutes': 'Minutes remaining',
                'badge-hours': 'Hours remaining',
                'badge-percentage': 'Percentage complete',
                'badge-none': 'No badge',

                // Days
                'monday': 'Monday',
                'tuesday': 'Tuesday',
                'wednesday': 'Wednesday',
                'thursday': 'Thursday',
                'friday': 'Friday',
                'saturday': 'Saturday',
                'sunday': 'Sunday',

                // Settings description
                'settings-desc': 'Customize your work time tracking experience'
            },
            vi: {
                // App
                'app-title': 'WorkTime Buddy',
                'app-tooltip': 'WorkTime Buddy - Theo dõi giờ làm việc',

                // UI Elements
                'today': 'Hôm nay',
                'startTime': 'Giờ bắt đầu',
                'lunchStart': 'Bắt đầu nghỉ trưa',
                'lunchEnd': 'Kết thúc nghỉ trưa',
                'requiredHours': 'Số giờ làm việc',
                'startNow': 'Bắt đầu ngay',
                'startLunch': 'Bắt đầu nghỉ trưa',
                'endLunch': 'Kết thúc nghỉ trưa',
                'resetToday': 'Đặt lại hôm nay',
                'endTime': 'Giờ kết thúc',
                'worked': 'Đã làm việc',
                'remaining': 'Còn lại',
                'overtime': 'Tăng ca',

                // Status
                'status.normal': 'Bình thường',
                'status.lunch': 'Nghỉ trưa',
                'status.overtime': 'Tăng ca',
                'status.ready': 'Sẵn sàng',
                'status.working': 'Đang làm việc',
                'on-track': 'Đúng tiến độ',
                'start-your-work-day': 'Bắt đầu ngày làm việc',
                'enjoy-your-break': 'Thưởng thức bữa trưa',
                'keep-it-up': 'Tiếp tục phát huy!',
                'time-to-go-home': 'Đến giờ về nhà!',

                // Options
                'settings': 'Cài đặt',
                'save': 'Lưu',
                'resetDefaults': 'Đặt lại mặc định',
                'preLeaveNotifyMinutes': 'Thông báo trước khi về (phút)',
                'cancel': 'Hủy',
                'export-data': 'Xuất cài đặt',
                'import-data': 'Nhập cài đặt',
                'reset-data': 'Đặt lại tất cả dữ liệu',
                'add-holiday': 'Thêm ngày nghỉ',

                // Settings Categories
                'general-settings': 'Cài đặt chung',
                'notification-settings': 'Cài đặt thông báo',
                'badge-settings': 'Cài đặt biểu tượng',
                'working-days-settings': 'Ngày làm việc',
                'holidays-settings': 'Ngày nghỉ lễ',
                'data-management': 'Quản lý dữ liệu',
                'language': 'Ngôn ngữ',
                'theme': 'Giao diện',
                'badge-mode': 'Chế độ hiển thị biểu tượng',

                // Descriptions
                'required-hours-desc': 'Số giờ làm việc mặc định mỗi ngày',
                'pre-leave-desc': 'Số phút trước giờ kết thúc để hiển thị nhắc nhở',
                'language-desc': 'Ngôn ngữ giao diện',
                'theme-desc': 'Giao diện trực quan cho tiện ích',
                'badge-mode-desc': 'Nội dung hiển thị trên biểu tượng tiện ích',
                'working-days-desc': 'Chọn những ngày bạn thường làm việc',
                'holidays-desc': 'Thêm các ngày nghỉ lễ khi bạn không làm việc',

                // Notifications
                'notif.preLeave.title': 'WorkTime Buddy',
                'notif.preLeave.msg': 'Bạn còn {minutes} phút nữa là hết giờ làm việc!',
                'notif.leaveNow.title': 'WorkTime Buddy',
                'notif.leaveNow.msg': 'Hết giờ làm việc rồi! Đến giờ về nhà! 🏠',
                'notif.backFromLunch.title': 'WorkTime Buddy',
                'notif.backFromLunch.msg': 'Chào mừng bạn quay lại sau giờ nghỉ trưa! Đến giờ làm việc! 💼',
                'notif.workEnded.title': 'WorkTime Buddy',
                'notif.workEnded.msg': 'Kết thúc ca làm việc! Chúc bạn có thời gian nghỉ ngơi tuyệt vời! 🌟',
                'notif.overtime.title': 'WorkTime Buddy',
                'notif.overtime.msg': 'Tiếp tục chế độ tăng ca. Nhớ nghỉ giải lao nhé! ⚠️',

                // Notification Settings
                'pre-leave-notification': 'Thông báo nhắc nhở trước khi về',
                'end-time-notification': 'Thông báo hết giờ làm việc',
                'lunch-end-notification': 'Thông báo kết thúc nghỉ trưa',
                'pre-leave-notification-desc': 'Nhận thông báo trước khi kết thúc ngày làm việc',
                'end-time-notification-desc': 'Nhận thông báo khi hết giờ làm việc',
                'lunch-end-notification-desc': 'Nhắc nhở quay lại làm việc sau nghỉ trưa',

                // Badge Modes
                'badge-minutes': 'Số phút còn lại',
                'badge-hours': 'Số giờ còn lại',
                'badge-percentage': 'Phần trăm hoàn thành',
                'badge-none': 'Không hiển thị',

                // Days
                'monday': 'Thứ Hai',
                'tuesday': 'Thứ Ba',
                'wednesday': 'Thứ Tư',
                'thursday': 'Thứ Năm',
                'friday': 'Thứ Sáu',
                'saturday': 'Thứ Bảy',
                'sunday': 'Chủ Nhật',

                // Settings description
                'settings-desc': 'Tùy chỉnh trải nghiệm theo dõi giờ làm việc'
            }
        };
    }

    init() {
        // Set initial language from storage or browser locale
        this.detectLanguage();
        this.translatePage();
    }

    async detectLanguage() {
        try {
            const result = await chrome.storage.sync.get(['language']);
            if (result.language) {
                this.currentLanguage = result.language;
            } else {
                // Detect browser language
                const browserLang = navigator.language || navigator.userLanguage;
                if (browserLang.startsWith('vi')) {
                    this.currentLanguage = 'vi';
                } else {
                    this.currentLanguage = 'en';
                }
            }
        } catch (error) {
            console.error('Error detecting language:', error);
            this.currentLanguage = 'en';
        }
    }

    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            this.translatePage();

            // Save language preference
            chrome.storage.sync.set({ language: language }).catch(error => {
                console.error('Error saving language preference:', error);
            });
        }
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else if (element.tagName === 'INPUT' && element.type === 'button') {
                    element.value = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations['en']?.[key] || key;
    }

    translate(key) {
        return this.getTranslation(key);
    }

    // Helper function for easy translation access
    t(key, replacements = {}) {
        let translation = this.getTranslation(key);

        // Replace placeholders like {minutes} with actual values
        Object.keys(replacements).forEach(placeholder => {
            const regex = new RegExp(`{${placeholder}}`, 'g');
            translation = translation.replace(regex, replacements[placeholder]);
        });

        return translation;
    }

    // Format time based on language
    formatTime(date, options = {}) {
        const defaultOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const formatOptions = { ...defaultOptions, ...options };

        if (this.currentLanguage === 'vi') {
            // Vietnamese time format
            return date.toLocaleTimeString('vi-VN', formatOptions);
        } else {
            // English time format
            return date.toLocaleTimeString('en-US', formatOptions);
        }
    }

    // Format date based on language
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const formatOptions = { ...defaultOptions, ...options };

        if (this.currentLanguage === 'vi') {
            return date.toLocaleDateString('vi-VN', formatOptions);
        } else {
            return date.toLocaleDateString('en-US', formatOptions);
        }
    }

    // Get localized notification messages
    getNotificationMessage(type) {
        const messages = {
            en: {
                preLeave: 'You have {minutes} minutes left before your work day ends!',
                endTime: 'Your work day is over! Time to go home! 🏠',
                lunchEnd: 'Welcome back from lunch! Time to get back to work! 💼',
                workEnded: 'Work session ended! Have a great rest of your day! 🌟',
                overtime: 'Continuing in overtime mode. Remember to take breaks! ⚠️'
            },
            vi: {
                preLeave: 'Bạn còn {minutes} phút nữa là hết giờ làm việc!',
                endTime: 'Hết giờ làm việc rồi! Đến giờ về nhà! 🏠',
                lunchEnd: 'Chào mừng bạn quay lại sau giờ nghỉ trưa! Đến giờ làm việc! 💼',
                workEnded: 'Kết thúc ca làm việc! Chúc bạn có thời gian nghỉ ngơi tuyệt vời! 🌟',
                overtime: 'Tiếp tục chế độ tăng ca. Nhớ nghỉ giải lao nhé! ⚠️'
            }
        };

        return messages[this.currentLanguage]?.[type] || messages['en']?.[type] || type;
    }

    // Replace placeholders in messages
    formatMessage(message, replacements = {}) {
        let formattedMessage = message;
        Object.keys(replacements).forEach(key => {
            const placeholder = `{${key}}`;
            formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), replacements[key]);
        });
        return formattedMessage;
    }
}

// Create global i18n instance
const i18n = new I18n();
