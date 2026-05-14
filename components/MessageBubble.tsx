import React from 'react';
import { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
  isOwnMessage: boolean; // true nếu là tin nhắn của người đang xem
}

const MessageBubble: React.FC<Props> = ({ message, isOwnMessage }) => {
  const isAI = message.sender === 'AI';

  return (
    <div className={`flex w-full mt-2 space-x-3 max-w-xs md:max-w-md ${isOwnMessage ? 'ml-auto justify-end' : ''}`}>
      {!isOwnMessage && (
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isAI ? 'bg-indigo-600' : 'bg-gray-800'}`}>
          {isAI ? 'AI' : (message.sender === 'ADMIN' ? 'AD' : 'U')}
        </div>
      )}
      
      <div>
        <div className={`p-3 rounded-2xl ${
          isOwnMessage 
            ? 'bg-black text-white rounded-tr-sm' 
            : 'bg-gray-100 text-gray-800 rounded-tl-sm border border-gray-200'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.timestamp && (
          <span className={`text-xs text-gray-400 mt-1 block ${isOwnMessage ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        )}
      </div>

      {isOwnMessage && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
          ME
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
