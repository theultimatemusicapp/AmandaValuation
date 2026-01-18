import { normalizeUrl } from '@/lib/website-audit';

const cases = [
    { input: 'https://example.com', shouldPass: true },
    { input: 'http://127.0.0.1:8080', shouldPass: false },
    { input: 'http://localhost:3000', shouldPass: false },
    { input: 'http://10.0.0.5', shouldPass: false },
    { input: 'file:///etc/passwd', shouldPass: false },
];

let failures = 0;

for (const testCase of cases) {
    let passed = false;
    try {
        normalizeUrl(testCase.input);
        passed = true;
    } catch {
        passed = false;
    }

    if (passed !== testCase.shouldPass) {
        failures += 1;
        console.error(`Test failed for ${testCase.input}. Expected ${testCase.shouldPass ? 'pass' : 'fail'}.`);
    } else {
        console.log(`Test passed for ${testCase.input}.`);
    }
}

if (failures > 0) {
    process.exit(1);
}
