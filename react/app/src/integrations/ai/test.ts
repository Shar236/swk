import { pdfLoader } from '@/integrations/ai/pdf-loader';
import { contextProvider } from '@/integrations/ai/context-provider';
import { aiApi } from '@/integrations/ai/ai-api';
import { speechEngine } from '@/integrations/ai/speech-engine';

export async function testChatbot() {
  console.log('🧪 Testing Chatbot Components...');
  
  try {
    // Test PDF Loader
    console.log('1. Testing PDF Loader...');
    const knowledgeBase = await pdfLoader.loadAllPdfs();
    console.log('✅ PDF Loader: Loaded', knowledgeBase.documents.length, 'documents');
    
    // Test Context Provider
    console.log('2. Testing Context Provider...');
    const context = await contextProvider.getChatContext();
    console.log('✅ Context Provider: Context loaded', {
      currentPage: context.currentPage,
      userStatus: context.userStatus,
      userRole: context.userRole,
      language: context.language
    });
    
    // Test AI API
    console.log('3. Testing AI API...');
    const apiProvider = aiApi.getApiProvider();
    console.log('✅ AI API: Using', apiProvider.toUpperCase(), 'provider');
    
    const aiResponse = await aiApi.sendMessage('Hello, what services do you offer?', context);
    console.log('✅ AI API: Response received', aiResponse.substring(0, 100) + '...');
    
    // Test Speech Engine
    console.log('4. Testing Speech Engine...');
    const isVoiceEnabled = speechEngine.isVoiceEnabled();
    console.log('✅ Speech Engine: Voice enabled =', isVoiceEnabled);
    
    console.log('🎉 All tests passed! Chatbot is ready to use with', apiProvider.toUpperCase(), 'API.');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}