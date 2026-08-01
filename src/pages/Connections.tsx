import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  MessageCircle,
  Share2,
  ChevronRight,
  Bell,
  Gift,
  Lightbulb,
  Flame,
  Star
} from 'lucide-react';

const members = [
  { 
    id: 1, 
    name: '张同学', 
    avatar: '👩', 
    role: '组长',
    tags: ['AI工具', '设计思维', '远程办公'],
    matched: true,
    lightGiven: false,
    mutualLight: true,
    topics: ['分享最近发现的AI工具', '聊聊远程办公的技巧']
  },
  { 
    id: 2, 
    name: '李同学', 
    avatar: '🧑', 
    role: '成员',
    tags: ['摄影', '咖啡文化'],
    matched: true,
    lightGiven: true,
    mutualLight: false,
    topics: ['推荐一家好咖啡馆', '分享摄影作品']
  },
  { 
    id: 3, 
    name: '王同学', 
    avatar: '👨', 
    role: '成员',
    tags: ['独立开发', '创业', '阅读'],
    matched: false,
    lightGiven: false,
    mutualLight: false,
    topics: ['讨论独立开发经验', '推荐好书']
  },
  { 
    id: 4, 
    name: '赵同学', 
    avatar: '👩‍🦰', 
    role: '成员',
    tags: ['设计思维', 'AI工具'],
    matched: true,
    lightGiven: false,
    mutualLight: false,
    topics: ['聊聊设计方法论', '分享AI使用技巧']
  },
  { 
    id: 5, 
    name: '陈同学', 
    avatar: '🧔', 
    role: '成员',
    tags: ['产品管理', '用户研究'],
    matched: false,
    lightGiven: false,
    mutualLight: false,
    topics: ['交流产品心得', '讨论用户案例']
  },
];

export default function Connections() {
  const [lightsRemaining, setLightsRemaining] = useState(3);
  const [litMembers, setLitMembers] = useState<Set<number>>(new Set([2]));
  const [mutualNotification, setMutualNotification] = useState(true);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [heartBurstId, setHeartBurstId] = useState<number | null>(null);

  const handleLight = (memberId: number) => {
    if (litMembers.has(memberId)) {
      setLitMembers(new Set([...litMembers].filter(id => id !== memberId)));
      setLightsRemaining(lightsRemaining + 1);
    } else if (lightsRemaining > 0) {
      setLitMembers(new Set([...litMembers, memberId]));
      setLightsRemaining(lightsRemaining - 1);
      setHeartBurstId(memberId);
      setTimeout(() => setHeartBurstId(null), 600);
    }
  };

  const selectedMemberData = members.find(m => m.id === selectedMember);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-brand-50 pb-20 md:pb-0">
      {/* Mutual Light Notification */}
      {mutualNotification && (
        <div className="fixed top-16 left-0 right-0 z-40 px-4 animate-slide-in-down">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-pink-500 to-brand-500 rounded-2xl shadow-lg p-4 flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">🎉 恭喜！你和张同学互留了灯</p>
                <p className="text-sm text-white/80">现在可以交换联系方式继续交流</p>
              </div>
              <button 
                onClick={() => setMutualNotification(false)}
                className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors font-medium"
              >
                查看
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/frequency-map" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回地图
            </Link>
            <button className="btn-secondary flex items-center gap-2 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </div>

          {/* Title & Stats */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-700 font-medium text-sm mb-4">
              <Heart className="w-4 h-4" />
              匿名留灯机制
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              对感兴趣的人<span className="gradient-text">留一盏灯</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              匿名表达继续交流的意愿，只有双方互留才会通知，降低社交压力
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center animate-fade-in-up">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-red-400 mx-auto mb-3 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display font-bold text-gray-900">{lightsRemaining}</div>
              <p className="text-sm text-gray-500">剩余灯数</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-teal-400 mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display font-bold text-gray-900">{litMembers.size}</div>
              <p className="text-sm text-gray-500">已留灯数</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 mx-auto mb-3 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-display font-bold text-gray-900">1</div>
              <p className="text-sm text-gray-500">互留成功</p>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {members.map((member, index) => {
              const isLit = litMembers.has(member.id);
              const isHeartBurst = heartBurstId === member.id;
              return (
                <div
                  key={member.id}
                  className="card card-hover p-5 animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center text-3xl">
                        {member.avatar}
                      </div>
                      {member.mutualLight && (
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-lg">{member.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-600 rounded-full font-medium">
                          {member.role}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {member.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {member.matched && (
                        <div className="flex items-center gap-1 text-sm text-green-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span>有 {member.tags.length} 个共同点</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSelectedMember(member.id)}
                        className="p-3 rounded-full bg-gray-100 hover:bg-brand-100 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleLight(member.id)}
                        disabled={!isLit && lightsRemaining === 0}
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isLit
                            ? 'bg-gradient-to-br from-pink-500 to-red-500 shadow-lg animate-pulse-glow'
                            : 'bg-gray-100 hover:bg-pink-100'
                        } ${isHeartBurst ? 'animate-heart-burst' : ''} ${
                          !isLit && lightsRemaining === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={isLit ? '取消留灯' : '留一盏灯'}
                      >
                        <Heart className={`w-6 h-6 transition-all ${isLit ? 'text-white fill-white' : 'text-gray-400'}`} />
                        {isHeartBurst && (
                          <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-50" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mutual Match Info Card */}
          <div className="mt-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-3xl p-6 text-white animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Gift className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl mb-2">互留成功！</h3>
                <p className="text-white/80 mb-4">
                  你和张同学互相留了灯，现在可以安全地交换联系方式，继续你们的交流
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-5 py-2.5 bg-white text-brand-600 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    交换微信
                  </button>
                  <button className="px-5 py-2.5 bg-white/20 rounded-full font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    分享名片
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggested Topics */}
          {selectedMemberData && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedMember(null)}>
              <div 
                className="bg-white rounded-3xl max-w-md w-full p-6 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center text-3xl">
                    {selectedMemberData.avatar}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl">{selectedMemberData.name}</h3>
                    <p className="text-sm text-gray-500">{selectedMemberData.tags.join(' · ')}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    AI 推荐的延续话题
                  </h4>
                  <div className="space-y-2">
                    {selectedMemberData.topics.map((topic, i) => (
                      <div 
                        key={i}
                        className="p-3 bg-gray-50 rounded-xl hover:bg-brand-50 cursor-pointer transition-colors flex items-center gap-3"
                      >
                        <Sparkles className="w-4 h-4 text-brand-500" />
                        <span className="text-sm">{topic}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="w-full btn-secondary"
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
