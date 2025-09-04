// WorkTime Buddy - Popup Script
class WorkTimePopup {
    constructor() {
        this.isExtensionEnv = typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id);
        this.currentState = {
            isWorking: false,
            startTime: null,
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
            let result = {};
            if (this.isExtensionEnv && chrome.storage?.sync) {
                result = await chrome.storage.sync.get([
                    'requiredHours', 'preLeaveMinutes', 'theme', 'language'
                ]);
            } else {
                // Dev fallback
                const stored = localStorage.getItem('worktime-buddy-settings');
                result = stored ? JSON.parse(stored) : {};
            }

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
            let result = {};
            if (this.isExtensionEnv && chrome.storage?.local) {
                result = await chrome.storage.local.get([
                    'isWorking', 'startTime', 'endTime', 'requiredHours'
                ]);
            } else {
                const stored = localStorage.getItem('worktime-buddy-state');
                result = stored ? JSON.parse(stored) : {};
            }

            if (result.startTime) {
                this.currentState.isWorking = result.isWorking || false;
                this.currentState.startTime = new Date(result.startTime);
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

        // Calculate total time needed (work hours + lunch break)
        let totalTimeNeeded = requiredHours;

        // Add lunch break duration if specified
        if (lunchStartInput.value && lunchEndInput.value) {
            const [lunchStartHour, lunchStartMinute] = lunchStartInput.value.split(':').map(Number);
            const [lunchEndHour, lunchEndMinute] = lunchEndInput.value.split(':').map(Number);

            const lunchStart = new Date();
            lunchStart.setHours(lunchStartHour, lunchStartMinute, 0, 0);

            const lunchEnd = new Date();
            lunchEnd.setHours(lunchEndHour, lunchEndMinute, 0, 0);

            const lunchDuration = (lunchEnd - lunchStart) / (1000 * 60 * 60);
            totalTimeNeeded += lunchDuration;
        }

        // Calculate end time
        const endTime = new Date(startTime.getTime() + (totalTimeNeeded * 60 * 60 * 1000));

        // Update UI
        document.getElementById('end-time').textContent =
            endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Persist to state so other logic (badge/alarms) can reference it if needed
        this.currentState.endTime = endTime;
        // Do not override startTime here; startTime is only set in startWork()
        // Optionally persist lightweight state (non-blocking)
        this.saveState?.();
    }

    async startWork() {
        if (this.currentState.isWorking) return;
        const startTimeInput = document.getElementById('start-time');
        if (!startTimeInput || !startTimeInput.value) {
            console.warn('Start time is empty; please provide a value in the start time input.');
            return;
        }

        const [hour, minute] = startTimeInput.value.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(hour, minute, 0, 0);

        this.currentState.isWorking = true;
        this.currentState.startTime = startTime;
        // Lunch timing is managed via inputs only; no state tracking

        await this.saveState();
        this.updateEndTime();
        this.setupAlarms();
        this.updateUI();
        this.updateBadge();

        // Notify background script
        if (this.isExtensionEnv && chrome.runtime?.sendMessage) {
            chrome.runtime.sendMessage({ action: 'workStarted', startTime: startTime.toISOString() });
        }
    }

    async endWork() {
        this.currentState.isWorking = false;

        await this.saveState();
        this.updateUI();
        this.updateBadge();

        chrome.runtime.sendMessage({ action: 'workEnded' });
    }

    async resetWork() {
        if (confirm('Are you sure you want to reset your work session?')) {
            this.currentState = {
                isWorking: false,
                startTime: null,
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
                startTime: this.currentState.startTime ? this.currentState.startTime.toISOString() : null,
                endTime: this.currentState.endTime ? this.currentState.endTime.toISOString() : null,
                requiredHours: this.currentState.requiredHours
            };

            if (this.isExtensionEnv && chrome.storage?.local) {
                await chrome.storage.local.set(stateToSave);
            } else {
                // Dev fallback when opened as a regular web page
                localStorage.setItem('worktime-buddy-state', JSON.stringify(stateToSave));
            }
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    setupAlarms() {
        if (!this.currentState.startTime) return;

        const endTime = this.calculateEndTime();
        const preLeaveTime = new Date(endTime.getTime() - (this.currentState.preLeaveMinutes * 60 * 1000));

        // Alarms are scheduled in background on 'workStarted'.
        // Keep this method for future use; no-op to avoid duplicate scheduling.
    }

    calculateEndTime() {
        if (!this.currentState.startTime) return null;

        // Calculate total time needed (work hours + lunch break from inputs)
        let totalTimeNeeded = this.currentState.requiredHours;

        const lunchStartInput = document.getElementById('lunch-start');
        const lunchEndInput = document.getElementById('lunch-end');
        if (lunchStartInput?.value && lunchEndInput?.value) {
            const [lsH, lsM] = lunchStartInput.value.split(':').map(Number);
            const [leH, leM] = lunchEndInput.value.split(':').map(Number);
            const ls = new Date(this.currentState.startTime);
            ls.setHours(lsH, lsM, 0, 0);
            const le = new Date(this.currentState.startTime);
            le.setHours(leH, leM, 0, 0);
            const lunchDuration = (le - ls) / (1000 * 60 * 60);
            if (!isNaN(lunchDuration) && lunchDuration > 0) {
                totalTimeNeeded += lunchDuration;
            }
        }

        // Calculate end time
        const endTime = new Date(this.currentState.startTime.getTime() + (totalTimeNeeded * 60 * 60 * 1000));
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
                    endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
            }
        } else {
            document.getElementById('worked-time').textContent = '00:00';
            document.getElementById('remaining-time').textContent = '08:00';

            const startTimeInput = document.getElementById('start-time');
            const lunchStartInput = document.getElementById('lunch-start');
            const lunchEndInput = document.getElementById('lunch-end');

            // If user has filled inputs, compute and show end time from inputs instead of default
            if (startTimeInput?.value) {
                this.updateEndTime();
            } else {
                document.getElementById('end-time').textContent = '18:00';
            }
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
        const endWorkBtn = document.getElementById('end-work');

        startWorkBtn.disabled = this.currentState.isWorking;
        // Only start/end work buttons are used now
        endWorkBtn.disabled = !this.currentState.isWorking;
    }

    async updateBadge() {
        try {
            if (!this.currentState.isWorking) {
                if (this.isExtensionEnv && chrome.action?.setBadgeText) {
                    chrome.action.setBadgeText({ text: '' });
                }
                return;
            }

            const endTime = this.calculateEndTime();
            if (!endTime) return;

            const now = new Date();
            const remainingTime = endTime - now;

            if (this.isExtensionEnv && chrome.action?.setBadgeText) {
                if (remainingTime <= 0) {
                    chrome.action.setBadgeText({ text: 'OT' });
                    chrome.action.setBadgeBackgroundColor({ color: '#ff4444' });
                } else {
                    const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));
                    chrome.action.setBadgeText({ text: remainingMinutes.toString() });
                    chrome.action.setBadgeBackgroundColor({ color: '#4facfe' });
                }
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
            if (this.isExtensionEnv && chrome.runtime?.sendMessage) {
                await chrome.runtime.sendMessage({ action: 'testNotification' });
                console.log('Test notification requested');
            } else {
                alert('Test notification only works inside the extension environment.');
            }
        } catch (error) {
            console.error('Error requesting test notification:', error);
            alert('Error requesting test notification. Check console for details.');
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkTimePopup();
});
