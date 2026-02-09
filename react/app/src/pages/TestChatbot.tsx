import { useEffect } from 'react';
import { testChatbot } from '@/integrations/ai/test';

export function TestChatbot() {
  useEffect(() => {
    const runTest = async () => {
      try {
        await testChatbot();
      } catch (error) {
        console.error('Test error:', error);
      }
    };
    
    runTest();
  }, []);

  return (
    <div className="p-4">
      <h1>Chatbot Test</h1>
      <p>Check the browser console for test results.</p>
    </div>
  );
}