// WorkTime Buddy - Popup Script
class WorkTimePopup {
    constructor() {
        this.currentState = {
            isWorking: false,
            isOnLunch: false,
            startTime: null,
            lunchStartTime: null,
            lunchEndTime: null,
            endTime: null,
            requiredHours: 8,
            preLeaveMinutes: 10
        };

        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadCurrentState();
        this.setupEventListeners();
        this.updateUI();
        this.startTimer();

        // Initialize i18n
        if (typeof i18n !== 'undefined') {
            i18n.init();
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get([
                'requiredHours', 'preLeaveMinutes', 'theme', 'language'
            ]);

            this.currentState.requiredHours = result.requiredHours || 8;
            this.currentState.preLeaveMinutes = result.preLeaveMinutes || 10;

            // Apply theme
            if (result.theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }

            // Set language
            if (result.language && typeof i18n !== 'undefined') {
                i18n.setLanguage(result.language);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async loadCurrentState() {
        try {
            const result = await chrome.storage.local.get([
                'isWorking', 'isOnLunch', 'startTime', 'lunchStartTime',
                'lunchEndTime', 'endTime', 'requiredHours'
            ]);

            if (result.startTime) {
                this.currentState.isWorking = result.isWorking || false;
                this.currentState.isOnLunch = result.isOnLunch || false;
                this.currentState.startTime = new Date(result.startTime);
                this.currentState.lunchStartTime = result.lunchStartTime ? new Date(result.lunchStartTime) : null;
                this.currentState.lunchEndTime = result.lunchEndTime ? new Date(result.lunchEndTime) : null;
                this.currentState.endTime = result.endTime ? new Date(result.endTime) : null;
                this.currentState.requiredHours = result.requiredHours || this.currentState.requiredHours;
            }
        } catch (error) {
            console.error('Error loading current state:', error);
        }
    }

    setupEventListeners() {
        // Time inputs
        document.getElementById('start-time').addEventListener('change', (e) => {
            this.updateEndTime();
        });

        document.getElementById('required-hours').addEventListener('change', (e) => {
            this.currentState.requiredHours = parseFloat(e.target.value);
            this.updateEndTime();
        });

        document.getElementById('lunch-start').addEventListener('change', (e) => {
            this.updateEndTime();
        });

        document.getElementById('lunch-end').addEventListener('change', (e) => {
            this.updateEndTime();
        });

        // Control buttons
        document.getElementById('start-work').addEventListener('click', () => {
            this.startWork();
        });

        document.getElementById('start-lunch').addEventListener('click', () => {
            this.startLunch();
        });

        document.getElementById('end-lunch').addEventListener('click', () => {
            this.endLunch();
        });

        document.getElementById('end-work').addEventListener('click', () => {
            this.endWork();
        });

        document.getElementById('options-btn').addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetWork();
        });

        // TEST NOTIFICATION BUTTON - REMOVE IN PRODUCTION
        document.getElementById('test-notification-btn').addEventListener('click', () => {
            this.testNotification();
        });
    }

    updateEndTime() {
        const startTimeInput = document.getElementById('start-time');
        const lunchStartInput = document.getElementById('lunch-start');
        const lunchEndInput = document.getElementById('lunch-end');
        const requiredHours = parseFloat(document.getElementById('required-hours').value);

        if (!startTimeInput.value) return;

        const startTime = new Date();
        const [startHour, startMinute] = startTimeInput.value.split(':').map(Number);
        startTime.setHours(startHour, startMinute, 0, 0);

        let endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + requiredHours);

        // Add lunch break if specified
        if (lunchStartInput.value && lunchEndInput.value) {
            const [lunchStartHour, lunchStartMinute] = lunchStartInput.value.split(':').map(Number);
            const [lunchEndHour, lunchEndMinute] = lunchEndInput.value.split(':').map(Number);

            const lunchStart = new Date();
            lunchStart.setHours(lunchStartHour, lunchStartMinute, 0, 0);

            const lunchEnd = new Date();
            lunchEnd.setHours(lunchEndHour, lunchEndMinute, 0, 0);

            const lunchDuration = (lunchEnd - lunchStart) / (1000 * 60 * 60);
            endTime.setHours(endTime.getHours() + lunchDuration);
        }

        document.getElementById('end-time').textContent =
            endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    async startWork() {
        const startTimeInput = document.getElementById('start-time');
        if (!startTimeInput.value) {
            // Use current time if no time specified
            const now = new Date();
            startTimeInput.value = now.toTimeString().slice(0, 5);
        }

        const [hour, minute] = startTimeInput.value.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(hour, minute, 0, 0);

        this.currentState.isWorking = true;
        this.currentState.startTime = startTime;
        this.currentState.isOnLunch = false;
        this.currentState.lunchStartTime = null;
        this.currentState.lunchEndTime = null;

        await this.saveState();
        this.updateEndTime();
        this.setupAlarms();
        this.updateUI();
        this.updateBadge();

        // Notify background script
        chrome.runtime.sendMessage({ action: 'workStarted', startTime: startTime.toISOString() });
    }

    async startLunch() {
        if (!this.currentState.isWorking) return;

        this.currentState.isOnLunch = true;
        this.currentState.lunchStartTime = new Date();

        await this.saveState();
        this.updateUI();
        this.updateBadge();

        chrome.runtime.sendMessage({ action: 'lunchStarted' });
    }

    async endLunch() {
        if (!this.currentState.isOnLunch) return;

        this.currentState.isOnLunch = false;
        this.currentState.lunchEndTime = new Date();

        await this.saveState();
        this.updateUI();
        this.updateBadge();

        chrome.runtime.sendMessage({ action: 'lunchEnded' });
    }

    async endWork() {
        this.currentState.isWorking = false;
        this.currentState.isOnLunch = false;

        await this.saveState();
        this.updateUI();
        this.updateBadge();

        chrome.runtime.sendMessage({ action: 'workEnded' });
    }

    async resetWork() {
        if (confirm('Are you sure you want to reset your work session?')) {
            this.currentState = {
                isWorking: false,
                isOnLunch: false,
                startTime: null,
                lunchStartTime: null,
                lunchEndTime: null,
                endTime: null,
                requiredHours: this.currentState.requiredHours,
                preLeaveMinutes: this.currentState.preLeaveMinutes
            };

            await this.saveState();
            this.updateUI();
            this.updateBadge();

            // Clear alarms
            chrome.runtime.sendMessage({ action: 'clearAlarms' });
        }
    }

    async saveState() {
        try {
            const stateToSave = {
                isWorking: this.currentState.isWorking,
                isOnLunch: this.currentState.isOnLunch,
                startTime: this.currentState.startTime ? this.currentState.startTime.toISOString() : null,
                lunchStartTime: this.currentState.lunchStartTime ? this.currentState.lunchStartTime.toISOString() : null,
                lunchEndTime: this.currentState.lunchEndTime ? this.currentState.lunchEndTime.toISOString() : null,
                endTime: this.currentState.endTime ? this.currentState.endTime.toISOString() : null,
                requiredHours: this.currentState.requiredHours
            };

            await chrome.storage.local.set(stateToSave);
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    setupAlarms() {
        if (!this.currentState.startTime) return;

        const endTime = this.calculateEndTime();
        const preLeaveTime = new Date(endTime.getTime() - (this.currentState.preLeaveMinutes * 60 * 1000));

        // Clear existing alarms
        chrome.runtime.sendMessage({ action: 'clearAlarms' });

        // Set pre-leave alarm
        chrome.runtime.sendMessage({
            action: 'setAlarm',
            name: 'preLeave',
            when: preLeaveTime.getTime()
        });

        // Set end time alarm
        chrome.runtime.sendMessage({
            action: 'setAlarm',
            name: 'endTime',
            when: endTime.getTime()
        });
    }

    calculateEndTime() {
        if (!this.currentState.startTime) return null;

        const endTime = new Date(this.currentState.startTime);
        endTime.setHours(endTime.getHours() + this.currentState.requiredHours);

        // Add lunch break if taken
        if (this.currentState.lunchStartTime && this.currentState.lunchEndTime) {
            const lunchDuration = (this.currentState.lunchEndTime - this.currentState.lunchStartTime) / (1000 * 60 * 60);
            endTime.setHours(endTime.getHours() + lunchDuration);
        }

        return endTime;
    }

    updateUI() {
        // Update input values
        if (this.currentState.startTime) {
            document.getElementById('start-time').value =
                this.currentState.startTime.toTimeString().slice(0, 5);
        }

        document.getElementById('required-hours').value = this.currentState.requiredHours;

        // Update time displays
        this.updateTimeDisplays();

        // Update status
        this.updateStatus();

        // Update button states
        this.updateButtonStates();
    }

    updateTimeDisplays() {
        const now = new Date();

        if (this.currentState.isWorking && this.currentState.startTime) {
            // Calculate worked time
            let workedTime = now - this.currentState.startTime;

            // Subtract lunch time if currently on lunch or lunch has ended
            if (this.currentState.isOnLunch && this.currentState.lunchStartTime) {
                workedTime -= (now - this.currentState.lunchStartTime);
            } else if (this.currentState.lunchStartTime && this.currentState.lunchEndTime) {
                workedTime -= (this.currentState.lunchEndTime - this.currentState.lunchStartTime);
            }

            const workedHours = Math.floor(workedTime / (1000 * 60 * 60));
            const workedMinutes = Math.floor((workedTime % (1000 * 60 * 60)) / (1000 * 60));

            document.getElementById('worked-time').textContent =
                `${workedHours.toString().padStart(2, '0')}:${workedMinutes.toString().padStart(2, '0')}`;

            // Calculate remaining time
            const endTime = this.calculateEndTime();
            if (endTime) {
                const remainingTime = endTime - now;
                const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
                const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

                if (remainingTime > 0) {
                    document.getElementById('remaining-time').textContent =
                        `${remainingHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
                } else {
                    document.getElementById('remaining-time').textContent = '00:00';
                }

                document.getElementById('end-time').textContent =
                    endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            }
        } else {
            document.getElementById('worked-time').textContent = '00:00';
            document.getElementById('remaining-time').textContent = '08:00';
            document.getElementById('end-time').textContent = '17:00';
        }
    }

        updateStatus() {
        const statusCard = document.getElementById('status-card');
        const statusIcon = document.getElementById('status-icon');
        const statusTitle = document.getElementById('status-title');
        const statusSubtitle = document.getElementById('status-subtitle');

        if (!this.currentState.isWorking) {
            statusCard.className = 'status-card status-normal';
            statusIcon.textContent = '⏰';
            statusTitle.textContent = i18n.t('status.ready');
            statusSubtitle.textContent = i18n.t('start-your-work-day');
        } else if (this.currentState.isOnLunch) {
            statusCard.className = 'status-card status-lunch';
            statusIcon.textContent = '🍽️';
            statusTitle.textContent = i18n.t('status.lunch');
            statusSubtitle.textContent = i18n.t('enjoy-your-break');
        } else {
            const endTime = this.calculateEndTime();
            const now = new Date();
            const remainingTime = endTime ? endTime - now : 0;

            if (remainingTime <= 0) {
                statusCard.className = 'status-card status-overtime';
                statusIcon.textContent = '⚠️';
                statusTitle.textContent = i18n.t('status.overtime');
                statusSubtitle.textContent = i18n.t('time-to-go-home');
            } else {
                statusCard.className = 'status-card status-normal';
                statusIcon.textContent = '💼';
                statusTitle.textContent = i18n.t('status.working');
                statusSubtitle.textContent = i18n.t('keep-it-up');
            }
        }
    }

    updateButtonStates() {
        const startWorkBtn = document.getElementById('start-work');
        const startLunchBtn = document.getElementById('start-lunch');
        const endLunchBtn = document.getElementById('end-lunch');
        const endWorkBtn = document.getElementById('end-work');

        startWorkBtn.disabled = this.currentState.isWorking;
        startLunchBtn.disabled = !this.currentState.isWorking || this.currentState.isOnLunch;
        endLunchBtn.disabled = !this.currentState.isOnLunch;
        endWorkBtn.disabled = !this.currentState.isWorking;
    }

    async updateBadge() {
        try {
            if (!this.currentState.isWorking) {
                chrome.action.setBadgeText({ text: '' });
                return;
            }

            const endTime = this.calculateEndTime();
            if (!endTime) return;

            const now = new Date();
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
            console.error('Error updating badge:', error);
        }
    }

    startTimer() {
        setInterval(() => {
            this.updateTimeDisplays();
            this.updateStatus();
            this.updateBadge();
        }, 1000);
    }

    // TEST NOTIFICATION METHOD - REMOVE IN PRODUCTION
    async testNotification() {
        try {
            // Test different types of notifications
            const notifications = [
                {
                    type: 'basic',
                    iconUrl: 'icons/clock.png',
                    title: 'Test Notification 1',
                    message: 'This is a test notification for pre-leave reminder!',
                    buttons: [
                        { title: 'OK' },
                        { title: 'Cancel' }
                    ]
                },
                {
                    type: 'basic',
                    iconUrl: 'icons/clock.png',
                    title: 'Test Notification 2',
                    message: 'This is a test notification for end time!',
                    buttons: [
                        { title: 'End Work' },
                        { title: 'Continue' }
                    ]
                },
                {
                    type: 'basic',
                    iconUrl: 'icons/clock.png',
                    title: 'Test Notification 3',
                    message: 'This is a test notification for lunch break!',
                    buttons: [
                        { title: 'End Lunch' },
                        { title: 'Dismiss' }
                    ]
                }
            ];

            // Show random notification
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            await chrome.notifications.create('test-notification', randomNotification);

            console.log('Test notification sent successfully');
        } catch (error) {
            console.error('Error sending test notification:', error);
            alert('Error sending test notification. Check console for details.');
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkTimePopup();
});
