import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import MoodWeather from '@/components/MoodWeather';
import WouldYouRather from '@/components/WouldYouRather';
import {
  ArrowLeft,
  Sparkles,
  Play,
  Users,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

export default function Warmup() {
  const navigate = useNavigate();
  const { members, startWarmup } = useStore();
  
  const [gameIndex, setGameIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const games = [
    {
      id: 'mood',
      title: '心情晴雨表',
      description: '快速了解大家此刻的心情和能量状态',
      duration: '约 2 分钟',
      participants: members.length,
      color: 'from-brand-500 to-purple-500',
      component: MoodWeather,
    },
    {
      id: 'would-you-rather',
      title: '你是否愿意...',
      description: '通过有趣的虚拟问题快速调动气氛',
      duration: '约 3 分钟',
      participants: members.length,
      color: 'from-pink-500 to-orange-400',
      component: WouldYouRather,
    },
  ];

  const handleNextGame = () => {
    if (gameIndex < games.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setGameIndex(gameIndex + 1);
        setTransitioning(false);
      }, 500);
    } else {
      setTransitioning(true);
      setTimeout(() => {
        navigate('/icebreak');
      }, 500);
    }
  };

  const handleSkip = () => {
    navigate('/icebreak');
  };

  const currentGame = games[gameIndex];
  const CurrentComponent = currentGame.component;
  const isLastGame = gameIndex === games.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-20 md:pb-0">
      {/* Top Banner */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            跳过热身
          </button>
          <div className="flex items-center gap-2 text-sm">
            {games.map((game, i) => (
              <div key={game.id} className="flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < gameIndex
                      ? 'bg-green-400 text-white'
                      : i === gameIndex
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < gameIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < games.length - 1 && (
                  <div className={`w-6 h-0.5 ${i < gameIndex ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {gameIndex + 1} / {games.length}
          </span>
        </div>
      </div>

      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Game Info Header */}
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full text-brand-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              破冰热身 · {currentGame.duration}
            </div>
            <h1 className={`text-3xl font-display font-bold mb-2 bg-gradient-to-r ${currentGame.color} bg-clip-text text-transparent`}>
              {currentGame.title}
            </h1>
            <p className="text-gray-500">{currentGame.description}</p>
          </div>

          {/* Participants */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{currentGame.participants} 位成员参与</span>
            <div className="flex -space-x-2">
              {members.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center text-sm border-2 border-white"
                >
                  {m.avatar}
                </div>
              ))}
              {members.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                  +{members.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Rules Card */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">游戏规则</h3>
                <p className="text-sm text-gray-600">
                  {currentGame.id === 'mood'
                    ? '依次为自己的心情（1-7分）和能量（1-10分）打分，提交后可查看团队整体状态'
                    : '回答 5 个有趣的二选一问题，了解大家的偏好和默契'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Game Component */}
          <div className={`transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
            <CurrentComponent onNext={handleNextGame} />
          </div>

          {/* Bottom Nav */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              跳过热身，直接进入破冰
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
