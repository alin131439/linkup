import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  ArrowLeft,
  Copy,
  Share2,
  Users,
  Clock,
  Sparkles,
  Play,
  Hash,
  UserCheck,
  UserPlus,
  Gift
} from 'lucide-react';

export default function RoomLobby() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const {
    roomCode,
    sceneTitle,
    sceneType,
    members,
    username,
    userRole,
    startWarmup,
    goToPhase,
    joinRoom,
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showJoinTip, setShowJoinTip] = useState(false);

  useEffect(() => {
    if (!roomCode && code) {
      joinRoom(code);
    }
  }, [code, roomCode, joinRoom]);

  const currentCode = roomCode || code || '----';

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleStart = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          startWarmup();
          setTimeout(() => navigate('/warmup'), 100);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sceneIcons: Record<string, string> = {
    course: '📚',
    project: '💼',
    industry: '🎯',
    hobby: '❤️',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-pink-50 pb-20 md:pb-0">
      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="text-9xl font-display font-bold text-white">{countdown}</div>
            <p className="text-white/80 mt-4 text-xl">开始破冰热身</p>
          </div>
        </div>
      )}

      {/* Join Tip Toast */}
      {showJoinTip && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in-down z-50">
          还需要至少 1 位成员加入才能开始
        </div>
      )}

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>

          {/* Room Info Card */}
          <div className="card p-6 animate-fade-in-up">
            <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl p-6 text-white text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">{sceneIcons[sceneType]}</span>
                <span className="text-white/80">{sceneTitle || '房间'}</span>
              </div>
              <p className="text-white/60 text-sm mb-2 flex items-center justify-center gap-1">
                <Hash className="w-4 h-4" />
                房间号
              </p>
              <div className="text-5xl md:text-6xl font-display font-bold tracking-[0.3em]">
                {currentCode}
              </div>
            </div>

            {/* Share Actions */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={copyCode}
                className="p-4 bg-gray-50 hover:bg-brand-50 rounded-xl transition-colors flex flex-col items-center gap-2"
              >
                {copied ? <UserCheck className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6 text-gray-600" />}
                <span className="text-sm font-medium text-gray-700">{copied ? '已复制' : '复制'}</span>
              </button>
              <button className="p-4 bg-gray-50 hover:bg-brand-50 rounded-xl transition-colors flex flex-col items-center gap-2">
                <Share2 className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">分享</span>
              </button>
              <button className="p-4 bg-gray-50 hover:bg-brand-50 rounded-xl transition-colors flex flex-col items-center gap-2">
                <Gift className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">邀请</span>
              </button>
            </div>

            {/* Share Message */}
            <div className="bg-gradient-to-r from-brand-50 to-pink-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">💡 发送到群组：</p>
              <div className="bg-white rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                大家好！我创建了一个 LinkUp 房间，房间号是{' '}
                <span className="font-bold text-brand-600 text-lg">{currentCode}</span>，快来加入吧！
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-500" />
                房间成员
              </h2>
              <span className="text-sm text-gray-500">{members.length} 人已加入</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl animate-fade-in-up"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center text-lg">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {member.id === 'me' ? (username || '我') : member.name}
                    </p>
                    {member.isOrganizer && (
                      <span className="text-xs text-brand-500">组织者</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {members.length < 5 && (
              <div className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">等待更多成员加入...</span>
              </div>
            )}

            {/* Animated dots for waiting */}
            {members.length < 2 && (
              <div className="flex justify-center gap-2 mt-4">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          {/* Start Button */}
          <div className="mt-8">
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-brand-500 to-purple-600 text-white py-5 rounded-2xl font-display font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              开始破冰热身
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            <p className="text-center text-sm text-gray-400 mt-3">
              将从「心情晴雨表」热身游戏开始
            </p>
          </div>

          {/* Tips */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-4 h-4" />
              预计 5 分钟完成热身
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
