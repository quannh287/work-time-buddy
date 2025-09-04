#!/usr/bin/env node

// Test script to verify time calculation logic
console.log('🧪 Testing WorkTime Buddy Time Calculation Logic\n');

// Test case: Start 8:30, Lunch 12:00-13:30 (1.5h), Required 8h
function testTimeCalculation() {
    console.log('📋 Test Case:');
    console.log('  - Start Time: 8:30');
    console.log('  - Lunch: 12:00 → 13:30 (1.5 hours)');
    console.log('  - Required Hours: 8 hours');
    console.log('  - Expected End Time: 18:00 (8:30 + 8h + 1.5h)\n');

    // Simulate the new logic
    const startTime = new Date();
    startTime.setHours(8, 30, 0, 0);
    
    const requiredHours = 8;
    const lunchDuration = 1.5; // 12:00 to 13:30 = 1.5 hours
    
    // New logic: total time needed = work hours + lunch break
    const totalTimeNeeded = requiredHours + lunchDuration;
    
    // Calculate end time
    const endTime = new Date(startTime.getTime() + (totalTimeNeeded * 60 * 60 * 1000));
    
    console.log('✅ New Logic Result:');
    console.log(`  - Start: ${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`);
    console.log(`  - End: ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`);
    console.log(`  - Total Time: ${totalTimeNeeded} hours`);
    console.log(`  - Work Hours: ${requiredHours} hours`);
    console.log(`  - Lunch Duration: ${lunchDuration} hours\n`);
    
    // Verify result
    const expectedEndTime = new Date();
    expectedEndTime.setHours(18, 0, 0, 0);
    
    if (endTime.getHours() === expectedEndTime.getHours() && 
        endTime.getMinutes() === expectedEndTime.getMinutes()) {
        console.log('🎉 SUCCESS: Time calculation is correct!');
        console.log('   End time matches expected 18:00');
    } else {
        console.log('❌ FAILED: Time calculation is incorrect!');
        console.log(`   Expected: 18:00, Got: ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`);
    }
}

// Test multiple scenarios
function testMultipleScenarios() {
    console.log('\n📊 Testing Multiple Scenarios:\n');
    
    const testCases = [
        {
            name: 'Standard 8h work with 1h lunch',
            start: '08:00',
            lunch: '12:00-13:00',
            required: 8,
            expected: '17:00'
        },
        {
            name: 'Late start with 1.5h lunch',
            start: '09:30',
            lunch: '12:30-14:00',
            required: 8,
            expected: '19:00'
        },
        {
            name: 'Early start with 30min lunch',
            start: '07:00',
            lunch: '12:00-12:30',
            required: 8,
            expected: '15:30'
        }
    ];
    
    testCases.forEach((testCase, index) => {
        console.log(`${index + 1}. ${testCase.name}`);
        
        const [startHour, startMin] = testCase.start.split(':').map(Number);
        const [lunchStart, lunchEnd] = testCase.lunch.split('-');
        const [lunchStartHour, lunchStartMin] = lunchStart.split(':').map(Number);
        const [lunchEndHour, lunchEndMin] = lunchEnd.split(':').map(Number);
        
        const startTime = new Date();
        startTime.setHours(startHour, startMin, 0, 0);
        
        const lunchStartTime = new Date();
        lunchStartTime.setHours(lunchStartHour, lunchStartMin, 0, 0);
        
        const lunchEndTime = new Date();
        lunchEndTime.setHours(lunchEndHour, lunchEndMin, 0, 0);
        
        const lunchDuration = (lunchEndTime - lunchStartTime) / (1000 * 60 * 60);
        const totalTimeNeeded = testCase.required + lunchDuration;
        
        const endTime = new Date(startTime.getTime() + (totalTimeNeeded * 60 * 60 * 1000));
        const actualEnd = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        console.log(`   Start: ${testCase.start}, Lunch: ${testCase.lunch} (${lunchDuration}h), Required: ${testCase.required}h`);
        console.log(`   Expected: ${testCase.expected}, Actual: ${actualEnd}`);
        
        if (actualEnd === testCase.expected) {
            console.log('   ✅ PASS\n');
        } else {
            console.log('   ❌ FAIL\n');
        }
    });
}

// Run tests
testTimeCalculation();
testMultipleScenarios();

console.log('🏁 Time calculation logic test completed!');
