import React from 'react';
import { User, Users } from 'lucide-react';

interface UserProps {
  id: string;
  username: string;
  isTyping?: boolean;
}

interface UsersListProps {
  users: UserProps[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gray-100">
        <div className="flex items-center space-x-2">
          <Users size={20} className="text-gray-700" />
          <h2 className="font-semibold text-gray-700">Online Users</h2>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {users.length} {users.length === 1 ? 'user' : 'users'} online
        </div>
      </div>
      
      <div className="p-2">
        {users.map(user => (
          <div 
            key={user.id} 
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
          >
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{user.username}</div>
              {user.isTyping && (
                <div className="text-xs text-gray-500">typing...</div>
              )}
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;