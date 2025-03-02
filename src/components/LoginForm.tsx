import React, { useState } from 'react';
import { MessageSquare, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    onLogin(username);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-500 text-white p-3 rounded-full">
              <MessageSquare size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Real-time Chat</h1>
          <p className="text-gray-600 mt-2">Connect with others in real-time</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Choose a username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your username"
                className={`w-full pl-10 pr-4 py-2 border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Join Chat
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>No registration required. Just choose a username and start chatting!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;