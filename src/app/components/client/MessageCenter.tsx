import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  MessageCircle, 
  Send, 
  Paperclip,
  X,
  CheckCheck,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { enCA, frCA, ptBR } from 'date-fns/locale';
import { API_ENDPOINTS } from '@/config/api';
import { fetchWithFallback } from '../../utils/apiHelper';

interface Message {
  id: string;
  clientId: string;
  senderId: string;
  senderRole: 'admin' | 'client';
  senderName: string;
  subject: string;
  content: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export function MessageCenter({ clientId }: { clientId: string }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // New message form
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; url: string; size: number }>>([]);

  const translations = {
    title: {
      en: 'Messages',
      fr: 'Messages',
      pt: 'Mensagens'
    },
    newMessage: {
      en: 'New Message',
      fr: 'Nouveau message',
      pt: 'Nova Mensagem'
    },
    subject: {
      en: 'Subject',
      fr: 'Sujet',
      pt: 'Assunto'
    },
    message: {
      en: 'Message',
      fr: 'Message',
      pt: 'Mensagem'
    },
    send: {
      en: 'Send',
      fr: 'Envoyer',
      pt: 'Enviar'
    },
    cancel: {
      en: 'Cancel',
      fr: 'Annuler',
      pt: 'Cancelar'
    },
    noMessages: {
      en: 'No messages yet',
      fr: 'Aucun message pour le moment',
      pt: 'Nenhuma mensagem ainda'
    },
    from: {
      en: 'From',
      fr: 'De',
      pt: 'De'
    },
    unread: {
      en: 'unread',
      fr: 'non lu',
      pt: 'não lido'
    },
    admin: {
      en: 'Admin',
      fr: 'Administrateur',
      pt: 'Administrador'
    },
    you: {
      en: 'You',
      fr: 'Vous',
      pt: 'Você'
    },
    attachments: {
      en: 'Attachments',
      fr: 'Pièces jointes',
      pt: 'Anexos'
    }
  };

  useEffect(() => {
    loadMessages();
    loadUnreadCount();
  }, [clientId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Not authenticated');

      const { data, isMocked } = await fetchWithFallback(
        `/messages?clientId=${clientId}`,
        {
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      if (isMocked) {
        toast.info('⚠️ Backend offline - showing demo data');
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const { data } = await fetchWithFallback(
        `/messages/unread-count?clientId=${clientId}`,
        {
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const sendMessage = async () => {
    if (!newSubject.trim() || !newContent.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Not authenticated');

      const response = await fetch(
        API_ENDPOINTS.messagesSend,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId,
            subject: newSubject,
            content: newContent,
            attachments
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      toast.success('Message sent successfully!');
      setNewSubject('');
      setNewContent('');
      setAttachments([]);
      setShowNewMessage(false);
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      await fetch(
        API_ENDPOINTS.messagesMarkRead(messageId),
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string, subject: string) => {
    if (!confirm(`Are you sure you want to delete the message "${subject}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Not authenticated');

      const response = await fetch(
        `${API_ENDPOINTS.messages(clientId)}/${messageId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete message');
      }

      // Remove from local state
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      
      // Close detail if this message was selected
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      
      toast.success('✅ Message deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete message: ${error.message}`);
    }
  };

  // Check if current user is admin
  const isAdmin = user?.user_metadata?.role === 'admin';

  const formatTimestamp = (timestamp: string): string => {
    const locales = {
      en: enCA,
      fr: frCA,
      pt: ptBR
    };

    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: locales[language]
    });
  };

  return (
    <Card className="p-6 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {translations.title[language]}
              </h2>
              {unreadCount > 0 && (
                <p className="text-sm text-purple-600 font-medium">
                  {unreadCount} {translations.unread[language]}
                </p>
              )}
            </div>
          </div>

          <Button onClick={() => setShowNewMessage(true)} className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4 mr-2" />
            {translations.newMessage[language]}
          </Button>
        </div>

        {/* New Message Form */}
        {showNewMessage && (
          <Card className="p-6 border-purple-300 bg-purple-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {translations.newMessage[language]}
              </h3>
              <button
                onClick={() => setShowNewMessage(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translations.subject[language]}
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translations.message[language]}
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowNewMessage(false)}
                >
                  {translations.cancel[language]}
                </Button>
                <Button onClick={sendMessage}>
                  <Send className="w-4 h-4 mr-2" />
                  {translations.send[language]}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Messages List */}
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Loading messages...</p>
          </Card>
        ) : messages.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">{translations.noMessages[language]}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  !message.isRead ? 'bg-purple-50 border-purple-300' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.isRead) {
                    markAsRead(message.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {message.subject}
                      </h4>
                      {!message.isRead && (
                        <Badge variant="destructive" className="text-xs">
                          {translations.unread[language]}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {message.content}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {message.senderRole === 'admin' ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {translations.from[language]}: {' '}
                        {message.senderRole === 'admin' 
                          ? translations.admin[language]
                          : message.senderId === user?.id 
                            ? translations.you[language]
                            : message.senderName
                        }
                      </span>
                      <span>{formatTimestamp(message.createdAt)}</span>
                      {message.isRead && <CheckCheck className="w-3 h-3 text-green-600" />}
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                        <Paperclip className="w-3 h-3" />
                        {message.attachments.length} {translations.attachments[language]}
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the message
                        handleDeleteMessage(message.id, message.subject);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedMessage.subject}
                      </h3>
                      {!selectedMessage.isRead && (
                        <Badge variant="destructive">
                          {translations.unread[language]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {translations.from[language]}: {selectedMessage.senderName} • {formatTimestamp(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {translations.attachments[language]}
                    </h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, idx) => (
                        <a
                          key={idx}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Paperclip className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{attachment.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}