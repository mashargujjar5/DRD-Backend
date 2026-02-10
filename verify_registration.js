const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/users' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(dataString);
        req.end();
    });
}

async function runTests() {
    console.log('Starting Registration Verification (HTTP Module)...');

    // Test Case 1: Successful Registration
    const newUser = {
        firstname: "Test",
        lastname: "User",
        email: `testuser_${Date.now()}@example.com`,
        phone: "1234567890",
        gender: "Male",
        password: "password123",
        confirmPassword: "password123"
    };

    console.log(`\nTest 1: Registering new user...`);
    try {
        const result1 = await postRequest('/register', newUser);
        if (result1.status === 201 && result1.data.success) {
            console.log('✅ Success: User registered successfully.');
            console.log('User Data:', result1.data.user);
        } else {
            console.log('❌ Failed: Could not register user.');
            console.log('Status:', result1.status);
            console.log('Response:', result1.data);
        }
    } catch (e) {
        console.log('❌ Failed: Network error or server not running.', e.message);
    }

    // Test Case 2: Password Mismatch
    console.log(`\nTest 2: Password Mismatch...`);
    const mismatchUser = {
        ...newUser,
        email: `mismatch_${Date.now()}@example.com`,
        confirmPassword: "wrongpassword"
    };
    try {
        const result2 = await postRequest('/register', mismatchUser);
        if (result2.status === 400 && result2.data.message === "Passwords do not match") {
            console.log('✅ Success: Correctly rejected mismatched passwords.');
        } else {
            console.log('❌ Failed: Did not reject mismatched passwords correctly.');
            console.log('Status:', result2.status);
            console.log('Response:', result2.data);
        }
    } catch (e) {
        console.log('❌ Failed: Network error.', e.message);
    }

    // Test Case 3: Missing Fields (Gender)
    console.log(`\nTest 3: Missing Gender...`);
    const missingGenderUser = {
        firstname: "No",
        lastname: "Gender",
        email: `nogender_${Date.now()}@example.com`,
        phone: "0987654321",
        password: "password123",
        confirmPassword: "password123"
    };
    try {
        const result3 = await postRequest('/register', missingGenderUser);
        if (result3.status === 400 || result3.status === 500) {
            if (result3.data.message === 'All fields are required' || (result3.data.message && result3.data.message.includes('validation failed'))) {
                console.log('✅ Success: Correctly rejected missing fields.');
            } else {
                console.log('⚠️  Warning: Rejected but message might differ:', result3.data.message);
            }
        } else {
            console.log('❌ Failed: Accepted user with missing fields.');
            console.log('Status:', result3.status);
            console.log('Response:', result3.data);
        }
    } catch (e) {
        console.log('❌ Failed: Network error.', e.message);
    }
}

runTests();
