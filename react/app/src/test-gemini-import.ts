// Simple test to check if imports are working
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('Testing Gemini import...');

try {
  const gemini = new GoogleGenerativeAI('test-key');
  console.log('✅ Gemini import successful');
} catch (error) {
  console.error('❌ Gemini import failed:', error);
}

export {};