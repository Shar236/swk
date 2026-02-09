import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function MinimalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hello from minimal chat!');

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(true)}>
          Open Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-2">
        <h3>Minimal Chat Test</h3>
        <Button variant="ghost" onClick={() => setIsOpen(false)}>X</Button>
      </div>
      <p>{message}</p>
      <Button onClick={() => setMessage('Chat is working!')}>Test</Button>
    </div>
  );
}