import React from 'react';
import { MessageSquare, Users, LogOut } from 'lucide-react';

interface ChatHeaderProps {
  username: string;
  onToggleUsers: () => void;
  onLogout: () => void;
  showUsers: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  username, 
  onToggleUsers, 
  onLogout,
  showUsers
}) => {
  return (
    <div className="bg-purple-600 text-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare size={24} />
          <h1 className="text-xl font-bold">Yennapa Pesuvomaa ?</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Logged in as:</span>
            <span className="font-semibold">{username}</span>
          </div>
          
          <button 
            onClick={onToggleUsers}
            className={`p-2 rounded-full transition ${showUsers ? 'bg-purple-700' : 'hover:bg-purple-700'}`}
            title="Toggle users list"
          >
            <Users size={20} />
          </button>
          
          <button 
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-purple-700 transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;