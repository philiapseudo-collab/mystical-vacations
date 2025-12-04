/**
 * PesaPal IPN Registration Script
 * 
 * One-time setup script to register your IPN URL with PesaPal and retrieve the IPN_ID.
 * 
 * Usage: npx tsx scripts/register-ipn.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.error('   Please create .env.local with your PesaPal credentials.');
  process.exit(1);
}

dotenv.config({ path: envPath });

// Configuration
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_ENV = process.env.PESAPAL_ENV || 'sandbox';
const SITE_URL = 'https://mysticalvacationsea.com';
const IPN_URL = `${SITE_URL}/api/webhooks/pesapal`;

// Determine base URL based on environment
const getBaseUrl = (): string => {
  if (PESAPAL_ENV === 'production') {
    return 'https://pay.pesapal.com/v3';
  }
  return 'https://cybqa.pesapal.com/pesapalv3';
};

const BASE_URL = getBaseUrl();

// Validate required environment variables
if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.error('❌ Error: Missing required environment variables!');
  console.error('   Required: PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET');
  console.error('   Please check your .env.local file.');
  process.exit(1);
}

interface PesaPalAuthResponse {
  token: string;
  expiryDate?: string;
}

interface PesaPalRegisterIPNResponse {
  ipn_id: string;
  url: string;
  ipn_notification_type: string;
  status?: string;
  message?: string;
}

/**
 * Step 1: Authenticate with PesaPal to get bearer token
 * Uses: POST /api/Auth/RequestToken
 */
async function authenticate(): Promise<string> {
  console.log('🔐 Step 1: Authenticating with PesaPal...');
  console.log(`   Environment: ${PESAPAL_ENV}`);
  console.log(`   Base URL: ${BASE_URL}`);

  const authUrl = `${BASE_URL}/api/Auth/RequestToken`;

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
    }

    const data: PesaPalAuthResponse = await response.json();

    if (!data.token) {
      throw new Error('Authentication failed: Token not found in response');
    }

    console.log('✅ Authentication successful!');
    return data.token;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Authentication error: ${error.message}`);
    } else {
      console.error('❌ Authentication error: Unknown error occurred');
    }
    throw error;
  }
}

/**
 * Step 2: Register IPN URL with PesaPal
 */
async function registerIPN(accessToken: string): Promise<string> {
  console.log('\n📝 Step 2: Registering IPN URL...');
  console.log(`   IPN URL: ${IPN_URL}`);
  console.log(`   Notification Type: POST`);

  const registerUrl = `${BASE_URL}/api/URLSetup/RegisterIPN`;

  try {
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url: IPN_URL,
        ipn_notification_type: 'POST',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IPN registration failed: ${response.status} - ${errorText}`);
    }

    const data: PesaPalRegisterIPNResponse = await response.json();

    if (!data.ipn_id) {
      throw new Error('IPN registration failed: ipn_id not found in response');
    }

    console.log('✅ IPN registration successful!');
    return data.ipn_id;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ IPN registration error: ${error.message}`);
    } else {
      console.error('❌ IPN registration error: Unknown error occurred');
    }
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 PesaPal IPN Registration Script');
  console.log('================================\n');

  try {
    // Step 1: Authenticate
    const accessToken = await authenticate();

    // Step 2: Register IPN
    const ipnId = await registerIPN(accessToken);

    // Step 3: Display result
    console.log('\n' + '='.repeat(50));
    console.log('✅ SUCCESS! IPN URL registered successfully.');
    console.log('='.repeat(50));
    console.log('\n📋 Your PesaPal IPN_ID:');
    console.log('─'.repeat(50));
    console.log(`   ${ipnId}`);
    console.log('─'.repeat(50));
    console.log('\n💡 Next Steps:');
    console.log('   1. Copy the IPN_ID above');
    console.log('   2. Add it to your .env.local file:');
    console.log(`      PESAPAL_IPN_ID=${ipnId}`);
    console.log('   3. Restart your application');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Script execution failed!');
    process.exit(1);
  }
}

// Run the script
main();

