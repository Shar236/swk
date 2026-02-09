import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">If you can see this, the basic React app is working.</p>
      <Button onClick={() => setCount(count + 1)}>
        Count: {count}
      </Button>
      <div className="mt-4">
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}