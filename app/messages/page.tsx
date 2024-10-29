"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@/components/auth/user-button";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { notificationService } from "@/lib/services/notification-service";

const conversations = [
  {
    id: 1,
    name: "Sarah Wilson",
    userId: "1",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    lastMessage: "That sounds great! Looking forward to it",
    time: "2m ago",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "Alex Chen",
    userId: "2",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    lastMessage: "Can you send me the design files?",
    time: "1h ago",
    unread: 0,
    online: true
  },
  {
    id: 3,
    name: "Emily Davis",
    userId: "3",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    lastMessage: "Perfect, thanks!",
    time: "2h ago",
    unread: 0,
    online: false
  }
];

const messages = [
  {
    id: 1,
    sender: "Sarah Wilson",
    content: "Hey! How's the project coming along?",
    time: "10:30 AM",
    isSender: false
  },
  {
    id: 2,
    sender: "You",
    content: "It's going well! I've finished the main features and now working on the UI improvements.",
    time: "10:32 AM",
    isSender: true
  },
  {
    id: 3,
    sender: "Sarah Wilson",
    content: "That sounds great! Looking forward to seeing it. When do you think you'll be done?",
    time: "10:33 AM",
    isSender: false
  }
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !newMessage.trim()) return;

    try {
      // Handle message sending logic here (e.g., API call to save message)
      await notificationService.sendMessageNotification(selectedConversation.userId, {
        id: session.user.id as string,
        name: session.user.name as string,
      });
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Messages</h1>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-12 gap-4 bg-white rounded-lg shadow-sm h-[calc(100vh-8rem)]">
          {/* Conversations List */}
          <div className="col-span-4 border-r">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search conversations..."
                  type="search"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-2 p-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation.id === conversation.id
                        ? "bg-primary/5"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{selectedConversation.name}</h3>
                  {selectedConversation.online && (
                    <span className="text-sm text-green-500">Online</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.isSender
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100"
                      } rounded-lg p-3`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}