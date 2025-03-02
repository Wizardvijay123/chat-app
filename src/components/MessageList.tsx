import React from 'react';

interface Message {
  id: string;
  username: string;
  text?: string;
  message?: string;
  timestamp: string;
}

interface TypingUser {
  id: string;
  username: string;
  isTyping: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  typingUsers: TypingUser[];
  messageEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUserId, 
  typingUsers,
  messageEndRef
}) => {
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex justify-center items-center h-full text-gray-500">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message, index) => {
          const isCurrentUser = message.id === currentUserId;
          const isSystemMessage = !message.text && message.message;
          
          if (isSystemMessage) {
            return (
              <div key={`system-${index}`} className="flex justify-center my-2">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-500">
                  {message.message}
                </div>
              </div>
            );
          }
          
          return (
            <div 
              key={`msg-${index}`} 
              className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  isCurrentUser 
                    ? 'bg-purple-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {!isCurrentUser && (
                  <div className="font-bold text-sm mb-1">{message.username}</div>
                )}
                <div>{message.text}</div>
                <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })
      )}
      
      {/* Typing indicators */}
      {typingUsers.filter(user => user.isTyping).map(user => (
        <div key={`typing-${user.id}`} className="flex items-center text-gray-500 text-sm mb-4">
          <span>{user.username} is typing</span>
          <span className="ml-1 flex">
            <span className="animate-bounce mx-px">.</span>
            <span className="animate-bounce animation-delay-200 mx-px">.</span>
            <span className="animate-bounce animation-delay-400 mx-px">.</span>
          </span>
        </div>
      ))}
      
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;