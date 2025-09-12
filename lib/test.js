// Pure Node.js test script to verify backend API per api.md
// This script DOES NOT import from ./deviceApi or ./apiClient
// Usage examples:
//   TOKEN=your_jwt node lib/test.js
//   TOKEN=your_jwt MAC=001A2B3C4D5E node lib/test.js
//   TOKEN=your_jwt node lib/test.js 001A2B3C4D5E

// Load env from .env.local when running via Node directly
try { require('dotenv').config({ path: '.env.local' }); } catch (_) {}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
console.log(BASE_URL);
const TOKEN = process.env.TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWZkNTFiODU3NmNkOGI1NTExM2JlYyIsImlhdCI6MTc1NzU4MjA5NywiZXhwIjoxNzU3NjY4NDk3fQ.HKz-ZxKhyd8ulUEb9GJHmDBlEAL64Gx2ZNLCJc-bfmg';
function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;
  return headers;
}

async function httpGet(path) {
  const url = `${BASE_URL}${path}`;
  console.log(`\n[GET] ${url}`);
  const res = await fetch(url, {
    method: 'GET',
    headers: authHeaders(),
  });
  const contentType = res.headers.get('content-type') || '';
  let body;
  try {
    body = contentType.includes('application/json') ? await res.json() : await res.text();
  } catch (e) {
    body = `<unable to parse body: ${e.message}>`;
  }
  console.log(`Status: ${res.status}`);
  console.log('Response:', body);
  if (!res.ok) {
    const err = new Error(`Request failed with status ${res.status}`);
    err.responseBody = body;
    err.status = res.status;
    throw err;
  }
  return body;
}

async function fetchAllDevices() {
  // per api.md: GET /api/v1/devices
  return httpGet('/api/v1/devices');
}

async function fetchDevicePorts(macAddress) {
  // per api.md: GET /api/v1/devices/{macAddress}/ports
  // Ensure safe path segment
  const macSeg = encodeURIComponent(macAddress);
  return httpGet(`/api/v1/devices/${macSeg}/ports`);
}

async function run() {
  console.log('=== Smart Device API Smoke Test ===');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Auth token provided: ${TOKEN ? 'YES' : 'NO (will likely get 401 if API requires auth)'}`);

  // 1) Fetch all registered devices
  let devices;
  try {
    devices = await fetchAllDevices();
  } catch (err) {
    console.error('\nFailed to fetch devices.');
    if (!TOKEN) {
      console.error('Hint: Set TOKEN env var to a valid Bearer token. Example:');
      console.error('  TOKEN=your_jwt node lib/test.js');
    }
    throw err;
  }

  // Normalize devices list if the API returns in different wrappers
  const deviceList = Array.isArray(devices)
    ? devices
    : (devices?.data || devices?.devices || devices?.items || []);

  console.log(`\nTotal devices found: ${deviceList.length}`);

  // Determine MAC to use for ports endpoint
  const cliMac = process.argv[2] || process.env.MAC || '';
  // Prefer macSymbolId from devices list when not provided
  let macToUse = cliMac || deviceList[0]?.macSymbolId || deviceList[0]?.mac || deviceList[0]?.macAddress || '';

  // Normalize to macSymbolId style if input looks like colon format
  if (macToUse && macToUse.includes(':')) {
    macToUse = macToUse.replace(/:/g, '').toUpperCase();
  }

  if (!macToUse) {
    console.warn('\nNo MAC provided and could not infer from devices list.');
    console.warn('Provide a MAC via CLI or env:');
    console.warn('  node lib/test.js 001A2B3C4D5E');
    console.warn('  MAC=001A2B3C4D5E node lib/test.js');
    return;
  }

  console.log(`\nUsing MAC: ${macToUse}`);

  // 2) Fetch/view all switch ports for the chosen device
  try {
    await fetchDevicePorts(macToUse);
  } catch (err) {
    console.error(`\nFailed to fetch ports for device ${macToUse}`);
    throw err;
  }

  console.log('\n=== Smoke test completed ===');
}

// Ensure global fetch exists (Node 18+). If not, notify clearly.
if (typeof fetch === 'undefined') {
  console.error('Global fetch is not available. Please run with Node.js v18+ or newer.');
  process.exit(1);
}

run().catch((e) => {
  console.error('\nTest run failed:', e.message);
  if (e.responseBody) {
    console.error('Server said:', e.responseBody);
  }
  process.exit(1);
});