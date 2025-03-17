
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ChatBoxProps {
  recipient: any;
  messages: any[];
  onSendMessage: (message: string) => void;
}

const ChatBox = ({ recipient, messages, onSendMessage }: ChatBoxProps) => {
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (!messageInput.trim()) return;
    
    // Simple content moderation
    const inappropriateWords = ['inappropriate', 'offensive', 'rude'];
    const hasInappropriateContent = inappropriateWords.some(word => 
      messageInput.toLowerCase().includes(word)
    );
    
    if (hasInappropriateContent) {
      toast.error("Your message contains inappropriate content", {
        description: "Please revise your message and try again."
      });
      return;
    }
    
    onSendMessage(messageInput);
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : msg.sender === 'system'
                    ? 'bg-secondary text-center w-full text-sm'
                    : 'bg-secondary'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <Textarea 
          className="min-h-[44px] resize-none"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button className="h-[44px]" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
