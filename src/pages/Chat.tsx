import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore, ChatMessage } from '@/store/useStore';
import {
  ArrowLeft,
  Send,
  Lightbulb,
  Sparkles,
  Users,
} from 'lucide-react';

const memberExtras: Record<string, { tags: string[]; topics: string[] }> = {
  m1: { tags: ['AI工具', '设计思维', '远程办公'], topics: ['分享最近发现的AI工具', '聊聊远程办公的技巧'] },
  m2: { tags: ['摄影', '咖啡文化'], topics: ['推荐一家好咖啡馆', '分享摄影作品'] },
  m3: { tags: ['独立开发', '创业', '阅读'], topics: ['讨论独立开发经验', '推荐好书'] },
  m4: { tags: ['设计思维', 'AI工具'], topics: ['聊聊设计方法论', '分享AI使用技巧'] },
  m5: { tags: ['产品管理', '用户研究', 'AI工具'], topics: ['聊聊产品方法论', '分享用户研究心得'] },
  m6: { tags: ['用户研究', '设计思维', '摄影'], topics: ['分享调研方法', '聊聊设计思维'] },
  m7: { tags: ['创业', '独立开发', '阅读'], topics: ['讨论创业方向', '推荐创业好书'] },
  m8: { tags: ['AI工具', '产品管理', '远程办公'], topics: ['分享AI在产品中的应用', '聊聊远程协作经验'] },
  m9: { tags: ['独立开发', '设计思维', 'AI工具'], topics: ['分享独立开发作品', '讨论设计与AI结合'] },
  m10: { tags: ['摄影', 'AI工具', '阅读'], topics: ['分享AI辅助摄影技巧', '推荐摄影书籍'] },
  m11: { tags: ['创业', '产品管理', '远程办公'], topics: ['聊聊创业项目', '分享远程管理经验'] },
  m12: { tags: ['用户研究', '摄影', '咖啡文化'], topics: ['分享调研案例', '推荐有格调的咖啡馆'] },
};

const MOCK_REPLIES = [
  '哈哈，我也这么觉得！',
  '这个想法很有意思，我们可以聊聊...',
  '我也在探索这个方向',
  '方便加个联系方式吗？',
  '很高兴认识你！',
];

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function Chat() {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();

  const members = useStore((s) => s.members);
  const chatMessages = useStore((s) => s.chatMessages);
  const lightConnections = useStore((s) => s.lightConnections);
  const openChat = useStore((s) => s.openChat);
  const closeChat = useStore((s) => s.closeChat);
  const sendMessage = useStore((s) => s.sendMessage);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const member = members.find((m) => m.id === memberId);
  const messages = memberId ? chatMessages[memberId] || [] : [];
  const lightConn = memberId
    ? lightConnections.find((l) => l.memberId === memberId)
    : undefined;
  const isMutual = lightConn?.mutual ?? false;
  const extras = memberId ? memberExtras[memberId] : undefined;

  useEffect(() => {
    if (memberId) {
      openChat(memberId);
    }
    return () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, [memberId, openChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateReply = useCallback((targetMemberId: string) => {
    const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
    const msg: ChatMessage = {
      id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: targetMemberId,
      text: reply,
      timestamp: Date.now(),
    };

    useStore.setState((state) => {
      const existing = state.chatMessages[targetMemberId] || [];
      return {
        chatMessages: {
          ...state.chatMessages,
          [targetMemberId]: [...existing, msg],
        },
      };
    });
  }, []);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || !memberId) return;

    sendMessage(memberId, text);
    setInputText('');

    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }

    const delay = 1000 + Math.random() * 1000;
    replyTimeoutRef.current = setTimeout(() => {
      simulateReply(memberId);
    }, delay);
  }, [inputText, memberId, sendMessage, simulateReply]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleNavigateNotes = () => {
    if (memberId) {
      navigate(`/notes/${memberId}`);
    }
  };

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">未找到该成员</p>
          <button
            onClick={() => navigate('/connections')}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const sharedTags = extras?.tags || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/connections')}
            className="p-2 -ml-2 text-gray-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-xl shadow-md">
              {member.avatar}
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{member.name}</h1>
              {isMutual && (
                <span className="inline-flex items-center gap-1 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-medium">
                  <Sparkles className="w-3 h-3" />
                  互相留灯
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full px-4 pt-4">
        <div className="bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">你们因为这些产生连接</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sharedTags.length > 0 ? (
              sharedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-white/80 text-sm">暂无共同标签</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-3">
        <div className="flex items-center gap-2 justify-center">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">
            你们已经互相留了灯，可以开始交流啦 🌟
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-2xl mx-auto space-y-4 pb-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            const sender = members.find((m) => m.id === msg.senderId);

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isMe ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    isMe
                      ? 'bg-gradient-to-br from-brand-500 to-purple-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {isMe ? '我' : (sender?.avatar || '👤')}
                </div>
                <div
                  className={`flex flex-col max-w-[75%] ${
                    isMe ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-xs text-gray-400 mb-1 px-1">
                    {isMe ? '我' : (sender?.name || member.name)} · {formatTime(msg.timestamp)}
                  </span>
                  <div
                    className={`px-4 py-2.5 rounded-2xl ${
                      isMe
                        ? 'bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-br-sm'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-2">
        <button
          onClick={handleNavigateNotes}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors text-sm font-medium"
        >
          <Lightbulb className="w-4 h-4" />
          📝 我的连接笔记
        </button>
      </div>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}