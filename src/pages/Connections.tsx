import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  Lightbulb,
  MessageCircle,
  Sparkles,
  Bell,
  ChevronRight,
  X,
  Crown,
  Zap,
  ArrowLeft,
  Star,
  Users,
} from 'lucide-react';

interface DisplayMember {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  topics: string[];
}

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

export default function Connections() {
  const navigate = useNavigate();

  const members = useStore((s) => s.members);
  const lightsRemaining = useStore((s) => s.lightsRemaining);
  const maxLightsPerDay = useStore((s) => s.maxLightsPerDay);
  const lightConnections = useStore((s) => s.lightConnections);
  const giveLight = useStore((s) => s.giveLight);
  const cancelLight = useStore((s) => s.cancelLight);
  const markMutual = useStore((s) => s.markMutual);
  const openChat = useStore((s) => s.openChat);

  const [showProModal, setShowProModal] = useState(false);
  const [flashBright, setFlashBright] = useState(false);
  const [bulbGlowId, setBulbGlowId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const mutualConnections = lightConnections.filter((l) => l.mutual);
  const litConnections = lightConnections.filter((l) => l.lit);
  const hasMutual = mutualConnections.length > 0;

  const isDark = !hasMutual || transitioning;

  useEffect(() => {
    if (hasMutual && !transitioning) {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [hasMutual]);

  const displayMembers: DisplayMember[] = members
    .filter((m) => m.id !== 'me')
    .map((m) => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      tags: memberExtras[m.id]?.tags || [],
      topics: memberExtras[m.id]?.topics || [],
    }));

  const handleLightbulbClick = useCallback(
    (memberId: string) => {
      const existing = lightConnections.find((l) => l.memberId === memberId);

      if (existing?.lit && !existing.mutual) {
        cancelLight(memberId);
        return;
      }

      if (existing?.mutual) {
        return;
      }

      const result = giveLight(memberId);
      if (result.success) {
        setBulbGlowId(memberId);
        setFlashBright(true);
        setTimeout(() => setFlashBright(false), 1200);
        setTimeout(() => setBulbGlowId(null), 1500);

        setTimeout(() => {
          markMutual(memberId);
        }, 3500);
      } else if (result.reason === 'no_lights') {
        setShowProModal(true);
      }
    },
    [lightConnections, giveLight, cancelLight, markMutual]
  );

  const handleMessageClick = useCallback(
    (memberId: string) => {
      const mutual = lightConnections.find((l) => l.memberId === memberId)?.mutual;
      if (mutual) {
        openChat(memberId);
        navigate(`/chat/${memberId}`);
      }
    },
    [lightConnections, openChat, navigate]
  );

  const handleEnterChat = useCallback(
    (memberId: string) => {
      openChat(memberId);
      navigate(`/chat/${memberId}`);
    },
    [openChat, navigate]
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 pb-20 ${
        isDark ? 'dark-bg' : 'light-bg'
      } ${transitioning ? 'animate-dark-to-light' : ''}`}
    >
      {flashBright && (
        <div className="fixed inset-0 z-50 pointer-events-none animate-flash-bright bg-white" />
      )}

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-2 transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-brand-600'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>
            <button
              className={`flex items-center gap-2 relative px-4 py-2 rounded-full transition-colors ${
                isDark
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              {mutualConnections.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {mutualConnections.length}
                </span>
              )}
            </button>
          </div>

          <div className="text-center mb-8 animate-fade-in-up">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm mb-4 ${
                isDark
                  ? 'bg-white/10 text-amber-300'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              匿名留灯机制
            </div>
            <h1
              className={`text-3xl md:text-4xl font-display font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              对感兴趣的人
              <span className="gradient-text">留一盏灯</span>
            </h1>
            <p
              className={`max-w-xl mx-auto ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              匿名表达继续交流的意愿，只有双方互留才会通知，降低社交压力
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div
              className={`rounded-2xl p-5 text-center animate-fade-in-up ${
                isDark ? 'dark-card' : 'bg-white shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-500">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div
                className={`text-3xl font-display font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {lightsRemaining}
              </div>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                剩余灯数
              </p>
            </div>

            <div
              className={`rounded-2xl p-5 text-center animate-fade-in-up ${
                isDark ? 'dark-card' : 'bg-white shadow-sm'
              }`}
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-400">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div
                className={`text-3xl font-display font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {litConnections.length}
              </div>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                已留灯数
              </p>
            </div>

            <div
              className={`rounded-2xl p-5 text-center animate-fade-in-up ${
                isDark ? 'dark-card' : 'bg-white shadow-sm'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-red-400 to-pink-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div
                className={`text-3xl font-display font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {mutualConnections.length}
              </div>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                互留成功
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {displayMembers.map((member, index) => {
              const lightConn = lightConnections.find(
                (l) => l.memberId === member.id
              );
              const isLit = lightConn?.lit || false;
              const isMutual = lightConn?.mutual || false;
              const isBulbGlowing = bulbGlowId === member.id;

              return (
                <div
                  key={member.id}
                  className={`p-5 rounded-2xl transition-all duration-300 animate-fade-in-up ${
                    isDark
                      ? 'dark-card hover:bg-white/10'
                      : 'bg-white shadow-sm hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                          isDark
                            ? 'bg-white/10'
                            : 'bg-gradient-to-br from-brand-100 to-pink-100'
                        }`}
                      >
                        {member.avatar}
                      </div>
                      {isMutual && (
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-display font-bold text-lg ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {member.name}
                        </h3>
                        {isMutual && (
                          <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full font-medium">
                            互相留灯
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {member.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDark
                                ? 'bg-white/10 text-gray-300'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleMessageClick(member.id)}
                        disabled={!isMutual}
                        className={`p-3 rounded-full transition-all ${
                          isMutual
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg hover:scale-105'
                            : isDark
                            ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        title={
                          isMutual
                            ? '进入聊天'
                            : '需要互相留灯才能聊天'
                        }
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleLightbulbClick(member.id)}
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isLit
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg'
                            : isDark
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-gray-100 hover:bg-amber-100'
                        } ${isBulbGlowing ? 'animate-bulb-light' : ''} ${
                          !isLit && lightsRemaining === 0
                            ? 'opacity-50 hover:opacity-75'
                            : ''
                        }`}
                        title={isLit ? '取消留灯' : lightsRemaining === 0 ? '留灯机会已用完，升级Pro解锁' : '留一盏灯'}
                      >
                        <Lightbulb
                          className={`w-6 h-6 transition-all ${
                            isLit
                              ? 'text-white bulb-glow'
                              : isDark
                              ? 'text-gray-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isMutual && (
                    <div
                      className={`mt-4 pt-4 border-t ${
                        isDark
                          ? 'border-white/10'
                          : 'border-gray-100'
                      }`}
                    >
                      <p
                        className={`text-sm mb-3 ${
                          isDark
                            ? 'text-amber-300'
                            : 'text-amber-600'
                        }`}
                      >
                        🎉 你们已经互相留了灯，现在可以安全地继续交流
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEnterChat(member.id)}
                          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          进入聊天
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {hasMutual && (
            <div
              className={`mt-8 rounded-3xl p-6 animate-fade-in-up ${
                isDark
                  ? 'bg-gradient-to-br from-brand-500 to-purple-600 text-white'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl mb-2">
                    互留成功！
                  </h3>
                  <p className="text-white/80 mb-4">
                    你和 {mutualConnections.length} 位同学互相留了灯，现在可以安全地继续交流
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {mutualConnections.map((mc) => {
                      const member = members.find((m) => m.id === mc.memberId);
                      if (!member) return null;
                      return (
                        <button
                          key={mc.memberId}
                          onClick={() => handleEnterChat(mc.memberId)}
                          className="px-5 py-2.5 bg-white text-amber-600 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          和 {member.name} 聊天
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowProModal(false)}
        >
          <div
            className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl max-w-sm w-full p-8 text-white animate-spawn-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center animate-pulse-glow">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-display font-bold text-center mb-3">
              今日留灯机会已用完
            </h3>
            <p className="text-center text-gray-300 mb-6 leading-relaxed">
              免费用户每日可留 <span className="text-amber-400 font-bold">3</span> 盏灯<br />
              升级 <span className="text-amber-400 font-bold">Pro</span>，解锁更多连接可能
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">每日 <span className="text-amber-400">无限</span> 留灯</p>
                  <p className="text-xs text-gray-400">不再错过任何同频的人</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">查看谁对你留了灯</p>
                  <p className="text-xs text-gray-400">了解谁在关注你</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">更多匹配推荐</p>
                  <p className="text-xs text-gray-400">AI智能扩展你的连接圈</p>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              升级 Pro
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              每月仅需 ¥29，随时可取消
            </p>
          </div>
        </div>
      )}
    </div>
  );
}