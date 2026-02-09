import { useEffect } from 'react';
import { Layout } from '@/components/layout/LayoutWithoutAiChat';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">RAHI Website</h1>
          <p className="text-xl mb-8">If you can see this, the app is working!</p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>✅ Basic React app is functioning correctly</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;