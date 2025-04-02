// File: src/pages/MessageBoard.jsx
import React, { useEffect, useState, useRef } from 'react';
import useToast from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import useActiveOrg from '../hooks/useActiveOrg';
import { Check, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // ✅ Your custom Supabase client

const MessageBoard = () => {
  const [orgUsers, setOrgUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const { session } = useAuth();
  const { orgId } = useActiveOrg();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();
  const user = session?.user;

  const fetchUsers = async () => {
    if (!orgId) return;
    try {
      const res = await fetch(`/api/org/users?organization_id=${orgId}`);
      const result = await res.json();
      if (res.ok) {
        setOrgUsers(result.users);
        const map = {};
        result.users.forEach((u) => {
          map[u.user_id] = u.username || 'Anonymous';
        });
        setUserMap(map);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({ type: 'error', message: 'Unable to fetch organization users' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [orgId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?organization_id=${orgId}`);
      const result = await res.json();
      if (res.ok) setMessages(result.messages);
      else throw new Error(result.error);
    } catch (err) {
      console.error('Fetch messages failed:', err);
      toast({ type: 'error', message: 'Unable to load messages' });
    }
  };

  useEffect(() => {
    if (!orgId) return;

  fetchMessages();
    const channel = supabase
      .channel('realtime:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new;
          if (newMsg.organization_id !== orgId) return;
  
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMsg.id);
            if (payload.eventType === 'INSERT' && !exists) {
              return [...prev, newMsg];
            } else if (payload.eventType === 'UPDATE') {
              return prev.map((msg) => (msg.id === newMsg.id ? newMsg : msg));
            }
            return prev;
          });
        }
      )
      .subscribe();
  
    return () => supabase.removeChannel(channel);
  }, [orgId]);

  useEffect(() => {
    if (!user?.id || !messages.length) return;
  
    messages.forEach((msg) => {
      if (!msg.read_by?.includes(user.id)) {
        fetch(`/api/messages/${msg.id}/read`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id }),
        });
      }
    });
  }, [messages, user]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          user_id: user.id,
          username: user.username,
          organization_id: orgId
        })
      });

      const result = await res.json();
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
        toast({ type: 'success', message: 'Message sent' });
        inputRef.current?.focus();
      } else throw new Error(result.error);
    } catch (err) {
      console.error('Send failed:', err);
      toast({ type: 'error', message: 'Failed to send message' });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 neon-text">💬 Message Board</h1>
  
      <div className="bg-slate-800 rounded-lg border border-border p-4 h-[500px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}
          >
            <p className="text-sm font-semibold text-sky-400">
              {msg.username || 'Anonymous'}
            </p>
  
            <div
              className={`relative px-3 py-2 rounded text-sm max-w-[80%] ${
                msg.user_id === user?.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
              }`}
            >
              {msg.content}
  
              <div className="flex gap-2 items-center text-xs text-slate-400 mt-1">
                <Clock size={12} /> {formatTime(msg.created_at)}
  
                {/* ✅ All users have seen */}
                {msg.read_by?.length === orgUsers.length && (
                  <span className="ml-2" title="Seen by all">
                    <Check size={12} className="text-green-400" />
                  </span>
                )}
  
                {/* ✅ Some users have seen, show hover tooltip */}
                {msg.read_by?.length > 0 && msg.read_by?.length < orgUsers.length && (
                  <span className="ml-2 cursor-help relative group">
                    <Check size={12} className="text-yellow-400" />
                    <span className="sr-only">
                      {`Seen by: ${msg.read_by.map((id) => userMap[id] || 'Anonymous').join(', ')}`}
                    </span>
                    <span
                      className="absolute bottom-full left-0 mb-1 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg z-10 hidden group-hover:block whitespace-nowrap"
                    >
                      {`Seen by: ${msg.read_by.map((id) => userMap[id] || 'Anonymous').join(', ')}`}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
  
      <div className="mt-4 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-slate-700 border border-border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="btn-neon px-4 py-2 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBoard;