import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testGeminiKey() {
    try {
        // 1. Read .env file
        const envPath = path.resolve(__dirname, '.env');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env file not found!');
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=["']?([^"'\n]+)["']?/);

        if (!match) {
            console.error('❌ VITE_GEMINI_API_KEY not found in .env');
            return;
        }

        const apiKey = match[1];
        console.log(`🔑 Found API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);

        // 2. Test API Call - List Models
        console.log('📡 Testing connection to Gemini API (listing models)...');
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Check Passed! Key is valid.');
            console.log('📜 Available Models:', data.models?.map(m => m.name) || 'None');
        } else {
            console.error(`❌ API Check Failed! Status: ${response.status}`);
            const errorText = await response.text();
            console.error('Errors:', errorText);
            console.log('\nPossible causes:\n1. API Key is invalid or expired.\n2. Generative Language API is not enabled in Google Cloud Console.\n3. Billing is not enabled for the project.');
        }

    } catch (error) {
        console.error('❌ Unexpected Error:', error);
    }
}

testGeminiKey();
