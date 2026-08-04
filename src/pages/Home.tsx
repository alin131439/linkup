import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, SceneType } from '@/store/useStore';
import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  DoorOpen, 
  Plus, 
  UserPlus,
  Copy,
  Share2,
  X,
  CheckCircle,
  Hash,
  QrCode
} from 'lucide-react';

const scenes: { id: SceneType; title: string; description: string; icon: React.ElementType; gradient: string }[] = [
  { id: 'course', title: '课程组队', description: '快速了解队友，高效完成课程项目', icon: GraduationCap, gradient: 'bg-hero-gradient' },
  { id: 'project', title: '项目合作', description: '跨部门协作，快速建立高效沟通', icon: Briefcase, gradient: 'bg-pink-gradient' },
  { id: 'industry', title: '行业活动', description: '拓展人脉，发现潜在合作机会', icon: Users, gradient: 'bg-blue-gradient' },
  { id: 'hobby', title: '兴趣社群', description: '找到同好，深度交流共同爱好', icon: Heart, gradient: 'bg-purple-gradient' },
];

export default function Home() {
  const navigate = useNavigate();
  const { createRoom, joinRoom, setUsername, username, roomCode } = useStore();
  
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');
  const [selectedScene, setSelectedScene] = useState<SceneType | null>(null);
  const [joinCode, setJoinCode] = useState(['', '', '', '']);
  const [step, setStep] = useState<'scene' | 'code' | 'share'>('scene');
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSceneSelect = (sceneId: SceneType) => {
    setSelectedScene(sceneId);
    if (!username) {
      setShowNameModal(true);
    } else {
      proceedToCreate();
    }
  };

  const proceedToCreate = () => {
    if (!selectedScene) return;
    const sceneTitle = scenes.find((s) => s.id === selectedScene)?.title || '';
    const code = createRoom(selectedScene, sceneTitle);
    setStep('share');
  };

  const handleNameSubmit = () => {
    if (!tempName.trim()) return;
    setUsername(tempName.trim());
    setShowNameModal(false);
    if (mode === 'create' && selectedScene) {
      setTimeout(() => proceedToCreate(), 100);
    } else {
      setMode('create');
      setStep('scene');
    }
  };

  const handleJoinInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...joinCode];
    newCode[index] = value;
    setJoinCode(newCode);
    if (value && index < 3) {
      const next = document.getElementById(`join-digit-${index + 1}`);
      next?.focus();
    }
  };

  const handleJoinSubmit = () => {
    const code = joinCode.join('');
    if (!/^\d{4}$/.test(code)) return;
    if (!username) {
      setShowNameModal(true);
      setMode('join');
      return;
    }
    if (joinRoom(code)) {
      navigate(`/room/${code}`);
    }
  };

  const handleJoinAfterName = () => {
    const code = joinCode.join('');
    if (joinRoom(code)) {
      navigate(`/room/${code}`);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const currentScene = scenes.find((s) => s.id === selectedScene);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 via-white to-white pb-20 md:pb-0">
      {/* Username Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowNameModal(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">设置你的昵称</h3>
              <p className="text-gray-500 text-sm">只需一个名字，即可开启破冰之旅</p>
            </div>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="输入你的昵称"
              maxLength={12}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-400 focus:outline-none mb-4"
              onKeyDown={(e) => e.key === 'Enter' && tempName.trim() && handleNameSubmit()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowNameModal(false)} className="flex-1 btn-secondary">
                跳过
              </button>
              <button
                onClick={mode === 'join' ? handleJoinAfterName : handleNameSubmit}
                disabled={!tempName.trim()}
                className="flex-1 btn-primary disabled:opacity-40"
              >
                开始使用
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full text-brand-700 font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              AI 驱动的破冰连接工具
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              轻松破冰，<span className="gradient-text">自然连接</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">三步快速进入房间，AI 为你生成破冰小游戏，让团队快速热络起来</p>
          </div>
        </div>
      </section>

      {/* Dual Entry Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Room Card */}
          <button
            onClick={() => setMode('create')}
            className={`group text-left card card-hover p-6 animate-fade-in-up ${
              mode === 'create' ? 'ring-2 ring-brand-400' : ''
            }`}
            style={{ animationDelay: '100ms' }}
          >
            <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl p-6 text-white mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <DoorOpen className="w-10 h-10 mb-3" />
              <h3 className="font-display font-bold text-2xl mb-1">创建房间</h3>
              <p className="text-white/80">选择场景，生成房间号</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Plus className="w-4 h-4" />
                组织者入口
              </span>
              <ArrowRight className="w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Join Room Card */}
          <button
            onClick={() => setMode('join')}
            className={`group text-left card card-hover p-6 animate-fade-in-up ${
              mode === 'join' ? 'ring-2 ring-brand-400' : ''
            }`}
            style={{ animationDelay: '200ms' }}
          >
            <div className="bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl p-6 text-white mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              <UserPlus className="w-10 h-10 mb-3" />
              <h3 className="font-display font-bold text-2xl mb-1">加入房间</h3>
              <p className="text-white/80">输入 4 位房间号加入</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Hash className="w-4 h-4" />
                参与者入口
              </span>
              <ArrowRight className="w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Create Room Flow */}
      {mode === 'create' && (
        <section className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
          <div className="max-w-3xl mx-auto">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {['选择场景', '创建房间', '分享邀请'].map((label, i) => {
                const currentStep = ['scene', 'code', 'share'].indexOf(step);
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                return (
                  <div key={label} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isActive ? 'bg-brand-500 text-white' :
                      isDone ? 'bg-brand-200 text-brand-700' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`ml-2 text-sm ${isActive ? 'text-brand-600 font-medium' : 'text-gray-500'}`}>
                      {label}
                    </span>
                    {i < 2 && <div className={`w-8 h-0.5 mx-2 ${isDone ? 'bg-brand-300' : 'bg-gray-200'}`} />}
                  </div>
                );
              })}
            </div>

            {step === 'scene' && (
              <div>
                <h2 className="section-title text-center mb-2">选择活动场景</h2>
                <p className="text-center text-gray-500 mb-8">AI 将根据场景为你生成最合适的破冰内容</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {scenes.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => handleSceneSelect(scene.id)}
                      className={`card card-hover p-4 text-center group ${
                        selectedScene === scene.id ? 'ring-2 ring-brand-400' : ''
                      }`}
                    >
                      <div className={`${scene.gradient} rounded-xl p-4 text-white mb-3`}>
                        <scene.icon className="w-8 h-8 mx-auto" />
                      </div>
                      <h3 className="font-semibold">{scene.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{scene.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'share' && roomCode && (
              <div className="text-center">
                <div className="card p-8 max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
                    <p className="text-white/80 text-sm mb-2">房间已创建</p>
                    <h2 className="font-display font-bold text-3xl mb-4">
                      {currentScene?.title}
                    </h2>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <p className="text-white/80 text-sm mb-2 flex items-center justify-center gap-1">
                        <Hash className="w-4 h-4" />
                        房间号
                      </p>
                      <div className="text-5xl md:text-6xl font-display font-bold tracking-[0.3em] mb-4">
                        {roomCode}
                      </div>
                      <div className="flex justify-center gap-3">
                        <button onClick={copyCode} className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2 text-sm">
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? '已复制' : '复制'}
                        </button>
                        <button className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2 text-sm">
                          <Share2 className="w-4 h-4" />
                          分享
                        </button>
                        <button className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2 text-sm">
                          <QrCode className="w-4 h-4" />
                          二维码
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-500 mb-3">📣 将房间号发送到群组：</p>
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                      大家好！我创建了一个 LinkUp 房间，房间号是 <span className="font-bold text-brand-600 text-lg">{roomCode}</span>，快来加入吧！
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">等待成员加入后开始破冰热身</p>

                  <button
                    onClick={() => navigate(`/room/${roomCode}`)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    进入房间
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Join Room Flow */}
      {mode === 'join' && (
        <section className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
          <div className="max-w-md mx-auto">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 mx-auto mb-6 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-2">输入房间号</h2>
              <p className="text-gray-500 text-sm mb-8">输入组织者分享的 4 位房间号</p>

              <div className="flex justify-center gap-4 mb-6">
                {joinCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`join-digit-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleJoinInput(index, e.target.value)}
                    className={`w-16 h-20 text-center text-3xl font-display font-bold rounded-xl border-2 focus:outline-none transition-all ${
                      digit
                        ? 'border-brand-400 bg-brand-50 text-brand-600'
                        : 'border-gray-200 bg-gray-50 text-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleJoinSubmit}
                disabled={joinCode.join('').length !== 4}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {username ? '进入房间' : '设置昵称并加入'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-gray-400 mt-4">
                无需注册，快速加入。首次使用只需设置昵称
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Feature highlights when not in a flow */}
      {mode === 'home' && (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: '三步快速进入',
                  desc: '创建/加入 → 热身 → 破冰，流畅无门槛',
                  icon: Sparkles,
                  color: 'from-brand-500 to-purple-500',
                },
                {
                  title: 'AI 智能热身',
                  desc: '心情晴雨表 + 你是否愿意，快速调动气氛',
                  icon: Users,
                  color: 'from-pink-500 to-orange-400',
                },
                {
                  title: '无需注册',
                  desc: '免注册直接使用，首次只需设置昵称',
                  icon: DoorOpen,
                  color: 'from-green-400 to-blue-500',
                },
              ].map((f) => (
                <div key={f.title} className="card card-hover p-6 animate-fade-in-up">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
