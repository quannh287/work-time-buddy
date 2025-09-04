// WorkTime Buddy - Options Script
class WorkTimeOptions {
    constructor() {
        this.settings = {
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
            },
            // New settings
            microBreakEnabled: false,
            microBreakInterval: 60,
            notificationStyle: 'rich',
            ttsEndTimeEnabled: false
        };

        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.populateUI();

        // Initialize i18n
        if (typeof i18n !== 'undefined') {
            i18n.init();
            i18n.setLanguage(this.settings.language);
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get([
                'requiredHours', 'preLeaveMinutes', 'theme', 'language',
                'badgeMode', 'weekdays', 'holidays', 'notifications',
                'microBreakEnabled', 'microBreakInterval', 'notificationStyle', 'ttsEndTimeEnabled'
            ]);

            this.settings = {
                requiredHours: result.requiredHours || 8,
                preLeaveMinutes: result.preLeaveMinutes || 10,
                theme: result.theme || 'light',
                language: result.language || 'en',
                badgeMode: result.badgeMode || 'minutes',
                weekdays: result.weekdays || [1, 2, 3, 4, 5],
                holidays: result.holidays || [],
                notifications: result.notifications || {
                    preLeave: true,
                    endTime: true,
                    lunchEnd: true
                },
                microBreakEnabled: result.microBreakEnabled ?? false,
                microBreakInterval: result.microBreakInterval ?? 60,
                notificationStyle: result.notificationStyle || 'rich',
                ttsEndTimeEnabled: result.ttsEndTimeEnabled ?? false
            };
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    setupEventListeners() {
        // Save settings button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Cancel button
        document.getElementById('cancel').addEventListener('click', () => {
            window.close();
        });

        // Export data button
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        // Import data button
        document.getElementById('import-data').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        // Import file input
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Reset data button
        document.getElementById('reset-data').addEventListener('click', () => {
            this.resetData();
        });

        // Add holiday button
        document.getElementById('add-holiday').addEventListener('click', () => {
            this.addHoliday();
        });

        // Theme change
        document.getElementById('theme').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        // Language change
        document.getElementById('language').addEventListener('change', (e) => {
            if (typeof i18n !== 'undefined') {
                i18n.setLanguage(e.target.value);
            }
        });
    }

    populateUI() {
        // General settings
        document.getElementById('required-hours').value = this.settings.requiredHours;
        document.getElementById('pre-leave-minutes').value = this.settings.preLeaveMinutes;
        document.getElementById('language').value = this.settings.language;
        document.getElementById('theme').value = this.settings.theme;

        // Notification settings
        document.getElementById('pre-leave-notification').checked = this.settings.notifications.preLeave;
        document.getElementById('end-time-notification').checked = this.settings.notifications.endTime;
        document.getElementById('lunch-end-notification').checked = this.settings.notifications.lunchEnd;

        // Micro-breaks & style & TTS
        document.getElementById('micro-break-enabled').checked = this.settings.microBreakEnabled;
        document.getElementById('micro-break-interval').value = this.settings.microBreakInterval;
        document.getElementById('notification-style').value = this.settings.notificationStyle;
        document.getElementById('tts-end-time-enabled').checked = this.settings.ttsEndTimeEnabled;

        // Badge settings
        document.getElementById('badge-mode').value = this.settings.badgeMode;

        // Weekdays
        const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        weekdays.forEach((day, index) => {
            document.getElementById(day).checked = this.settings.weekdays.includes(index + 1);
        });

        // Holidays
        this.populateHolidays();

        // Apply theme
        this.applyTheme(this.settings.theme);
    }

    populateHolidays() {
        const holidaysList = document.getElementById('holidays-list');
        holidaysList.innerHTML = '';

        this.settings.holidays.forEach((holiday, index) => {
            const holidayItem = document.createElement('div');
            holidayItem.className = 'holiday-item';
            holidayItem.innerHTML = `
                <div class="holiday-info">
                    <div class="holiday-date">${holiday.date}</div>
                    <div class="holiday-name">${holiday.name}</div>
                </div>
                <button type="button" class="remove-holiday" data-index="${index}">Remove</button>
            `;

            // Add remove event listener
            holidayItem.querySelector('.remove-holiday').addEventListener('click', (e) => {
                this.removeHoliday(parseInt(e.target.dataset.index));
            });

            holidaysList.appendChild(holidayItem);
        });
    }

    addHoliday() {
        const dateInput = document.getElementById('holiday-date');
        const nameInput = document.getElementById('holiday-name');

        if (!dateInput.value || !nameInput.value.trim()) {
            this.showMessage('Please enter both date and name for the holiday.', 'error');
            return;
        }

        const holiday = {
            date: dateInput.value,
            name: nameInput.value.trim()
        };

        // Check if holiday already exists
        if (this.settings.holidays.some(h => h.date === holiday.date)) {
            this.showMessage('A holiday for this date already exists.', 'error');
            return;
        }

        this.settings.holidays.push(holiday);
        this.settings.holidays.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Clear inputs
        dateInput.value = '';
        nameInput.value = '';

        // Update UI
        this.populateHolidays();
        this.showMessage('Holiday added successfully!', 'success');
    }

    removeHoliday(index) {
        this.settings.holidays.splice(index, 1);
        this.populateHolidays();
        this.showMessage('Holiday removed successfully!', 'success');
    }

    async saveSettings() {
        try {
            // Collect form data
            this.settings.requiredHours = parseFloat(document.getElementById('required-hours').value);
            this.settings.preLeaveMinutes = parseInt(document.getElementById('pre-leave-minutes').value);
            this.settings.theme = document.getElementById('theme').value;
            this.settings.language = document.getElementById('language').value;
            this.settings.badgeMode = document.getElementById('badge-mode').value;

            // Notification settings
            this.settings.notifications = {
                preLeave: document.getElementById('pre-leave-notification').checked,
                endTime: document.getElementById('end-time-notification').checked,
                lunchEnd: document.getElementById('lunch-end-notification').checked
            };

            // Micro-breaks & style & TTS
            this.settings.microBreakEnabled = document.getElementById('micro-break-enabled').checked;
            this.settings.microBreakInterval = parseInt(document.getElementById('micro-break-interval').value) || 60;
            this.settings.notificationStyle = document.getElementById('notification-style').value;
            this.settings.ttsEndTimeEnabled = document.getElementById('tts-end-time-enabled').checked;

            // Weekdays
            const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            this.settings.weekdays = weekdays
                .map((day, index) => document.getElementById(day).checked ? index + 1 : null)
                .filter(day => day !== null);

            // Save to storage
            await chrome.storage.sync.set(this.settings);

            // Apply theme immediately
            this.applyTheme(this.settings.theme);

            // Show success message
            this.showMessage('Settings saved successfully!', 'success');

            // Close after a short delay
            setTimeout(() => {
                window.close();
            }, 1500);

        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings. Please try again.', 'error');
        }
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    exportData() {
        try {
            const dataStr = JSON.stringify(this.settings, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'worktime-buddy-settings.json';
            link.click();

            this.showMessage('Settings exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showMessage('Error exporting settings. Please try again.', 'error');
        }
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);

                // Validate imported settings
                if (this.validateSettings(importedSettings)) {
                    this.settings = { ...this.settings, ...importedSettings };
                    this.populateUI();
                    this.showMessage('Settings imported successfully!', 'success');
                } else {
                    this.showMessage('Invalid settings file. Please check the format.', 'error');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                this.showMessage('Error importing settings. Please check the file format.', 'error');
            }
        };

        reader.readAsText(file);
    }

    validateSettings(settings) {
        const requiredFields = ['requiredHours', 'preLeaveMinutes', 'theme', 'language'];
        return requiredFields.every(field => settings.hasOwnProperty(field));
    }

    async resetData() {
        if (confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
            try {
                await chrome.storage.sync.clear();
                await chrome.storage.local.clear();

                // Reset to defaults
                this.settings = {
                    requiredHours: 8,
                    preLeaveMinutes: 10,
                    theme: 'light',
                    language: 'en',
                    badgeMode: 'minutes',
                    weekdays: [1, 2, 3, 4, 5],
                    holidays: [],
                    notifications: {
                        preLeave: true,
                        endTime: true,
                        lunchEnd: true
                    }
                };

                this.populateUI();
                this.showMessage('All data has been reset to defaults.', 'success');

            } catch (error) {
                console.error('Error resetting data:', error);
                this.showMessage('Error resetting data. Please try again.', 'error');
            }
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insert at the top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageDiv, mainContent.firstChild);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkTimeOptions();
});
