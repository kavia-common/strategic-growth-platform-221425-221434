'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { Conversation, Message } from '@/types';
import { Send, Plus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const orgId = localStorage.getItem('currentOrgId');
        if (!orgId) return;
        const data = await api.get<Conversation[]>(`/conversations?orgId=${orgId}`);
        setConversations(data);
        // Use functional update to avoid dependency on selectedConversation
        setSelectedConversation(curr => curr || (data.length > 0 ? data[0] : null));
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    };
    fetchConvs();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      subscribeToMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (convId: string) => {
    try {
      const data = await api.get<Message[]>(`/conversations/${convId}/messages`);
      setMessages(data);
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  };

  const subscribeToMessages = (convId: string) => {
    const channel = supabase
      .channel(`messages:${convId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${convId}`
      }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages(prev => {
          if (prev.find(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createConversation = async () => {
    const title = prompt('Enter conversation title:');
    if (!title) return;

    try {
      const orgId = localStorage.getItem('currentOrgId');
      const newConv = await api.post<Conversation>('/conversations', { title, orgId });
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv);
    } catch (e) {
      console.error('Failed to create conversation', e);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const tempContent = newMessage;
    setNewMessage('');

    try {
      await api.post(`/conversations/${selectedConversation.id}/messages`, {
        content: tempContent
      });
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      <Card className="w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-semibold text-gray-700">Conversations</h3>
          <Button size="sm" variant="ghost" onClick={createConversation}>
            <Plus size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={cn(
                "w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex items-center gap-3",
                selectedConversation?.id === conv.id
                  ? "bg-blue-50 text-primary font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <MessageSquare size={16} />
              <span className="truncate">{conv.title}</span>
            </button>
          ))}
          {conversations.length === 0 && (
             <div className="text-center text-gray-400 text-sm py-8">No conversations yet</div>
          )}
        </div>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold">{selectedConversation.title}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-2 rounded-lg text-sm",
                      msg.role === 'user'
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    )}
                  >
                    <p>{msg.content}</p>
                    <span className={cn(
                        "text-[10px] block mt-1 opacity-70",
                         msg.role === 'user' ? "text-blue-100" : "text-gray-500"
                    )}>
                        {msg.created_at ? format(new Date(msg.created_at), 'HH:mm') : ''}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-white"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  );
}
