import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send } from "lucide-react";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import UsersList from "./components/UsersList";
import LoginForm from "./components/LoginForm";

// Types
interface Message {
  id: string;
  username: string;
  text?: string;
  message?: string;
  timestamp: string;
}

interface User {
  id: string;
  username: string;
  isTyping?: boolean;
}

interface TypingUser {
  id: string;
  username: string;
  isTyping: boolean;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Get existing messages
    socket.on("get-messages", (existingMessages: Message[]) => {
      console.log("Received existing messages:", existingMessages);
      setMessages(existingMessages);
    });

    // Handle new messages
    socket.on("new-message", (message: Message) => {
      console.log("Received new message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle user joined
    socket.on("user-joined", (data: Message) => {
      console.log("User joined:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setUsers((prevUsers) => {
        const exists = prevUsers.some((user) => user.id === data.id);
        if (!exists) {
          return [...prevUsers, { id: data.id, username: data.username }];
        }
        return prevUsers;
      });
    });

    // Handle user left
    socket.on("user-left", (data: Message) => {
      console.log("User left:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== data.id));
      setTypingUsers((prevTypingUsers) =>
        prevTypingUsers.filter((user) => user.id !== data.id)
      );
    });

    // Handle typing indicator
    socket.on("user-typing", (data: TypingUser) => {
      setTypingUsers((prevTypingUsers) => {
        const existingIndex = prevTypingUsers.findIndex(
          (user) => user.id === data.id
        );

        if (existingIndex !== -1) {
          const newTypingUsers = [...prevTypingUsers];
          newTypingUsers[existingIndex] = data;
          return newTypingUsers;
        } else if (data.isTyping) {
          return [...prevTypingUsers, data];
        }

        return prevTypingUsers;
      });
    });

    return () => {
      socket.off("get-messages");
      socket.off("new-message");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("user-typing");
    };
  }, [socket]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle login
  const handleLogin = (username: string) => {
    if (username.trim() && socket) {
      setUsername(username);
      socket.emit("user-join", username);
      setIsLoggedIn(true);
    }
  };

  // Handle sending messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      console.log("Sending message:", message);
      socket.emit("send-message", { text: message });
      setMessage("");
      // Stop typing indicator
      socket.emit("typing", false);
    }
  };

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (socket) {
      if (e.target.value.length > 0) {
        socket.emit("typing", true);
      } else {
        socket.emit("typing", false);
      }
    }
  };

  // Toggle users sidebar
  const toggleUsersList = () => {
    setShowUsers(!showUsers);
  };

  // Handle logout
  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
      window.location.reload();
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Connection Status */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-1 z-50">
          Disconnected from server. Please check if the server is running.
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader
          username={username}
          onToggleUsers={toggleUsersList}
          onLogout={handleLogout}
          showUsers={showUsers}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col bg-white">
            <MessageList
              messages={messages}
              currentUserId={socket?.id || ""}
              typingUsers={typingUsers}
              messageEndRef={messageEndRef}
            />

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-300 bg-white"
            >
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="m-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!message.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Users Sidebar */}
          {showUsers && <UsersList users={users} />}
        </div>
      </div>
    </div>
  );
}

export default App;
