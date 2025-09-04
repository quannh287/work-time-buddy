#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class TestCodeRemover {
    constructor() {
        this.rootDir = __dirname;
    }

    removeTestCode() {
        console.log('🧹 Removing test notification code...\n');

        try {
            this.removeFromPopupHTML();
            this.removeFromPopupJS();
            console.log('✅ Test notification code removed successfully!');
            console.log('\n📝 Next steps:');
            console.log('1. Run npm run build to create production package');
            console.log('2. Test the extension to ensure everything works');
        } catch (error) {
            console.error('❌ Error removing test code:', error.message);
            process.exit(1);
        }
    }

    removeFromPopupHTML() {
        console.log('📄 Removing test button from popup.html...');

        const popupPath = path.join(this.rootDir, 'popup.html');
        let content = fs.readFileSync(popupPath, 'utf8');

        // Remove the test notification button
        content = content.replace(
            /            <!-- TEST NOTIFICATION BUTTON - REMOVE IN PRODUCTION -->\s*\n\s*<button id="test-notification-btn"[^>]*>Test Notification<\/button>\s*\n/,
            ''
        );

        fs.writeFileSync(popupPath, content);
        console.log('✅ Test button removed from popup.html');
    }

    removeFromPopupJS() {
        console.log('⚡ Removing test code from popup.js...');

        const popupPath = path.join(this.rootDir, 'popup.js');
        let content = fs.readFileSync(popupPath, 'utf8');

        // Remove test notification event listener
        content = content.replace(
            /        \/\/ TEST NOTIFICATION BUTTON - REMOVE IN PRODUCTION\s*\n\s*document\.getElementById\('test-notification-btn'\)\.addEventListener\('click', \(\) => \{\s*\n\s*this\.testNotification\(\);\s*\n\s*\}\);\s*\n/,
            ''
        );

        // Remove test notification method
        content = content.replace(
            /    \/\/ TEST NOTIFICATION METHOD - REMOVE IN PRODUCTION\s*\n\s*async testNotification\(\) \{[^}]+\}\s*\n/,
            ''
        );

        fs.writeFileSync(popupPath, content);
        console.log('✅ Test code removed from popup.js');
    }
}

// Run if this script is executed directly
if (require.main === module) {
    const remover = new TestCodeRemover();
    remover.removeTestCode();
}

module.exports = TestCodeRemover;
