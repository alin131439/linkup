import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Smile, Zap, ArrowRight, Sparkles } from 'lucide-react';

const moodOptions = [
  { level: 1, emoji: '😫', label: '糟糕', color: 'from-red-400 to-red-500' },
  { level: 2, emoji: '😕', label: '不太好', color: 'from-orange-400 to-orange-500' },
  { level: 3, emoji: '😐', label: '一般', color: 'from-yellow-400 to-yellow-500' },
  { level: 4, emoji: '🙂', label: '还不错', color: 'from-lime-400 to-green-500' },
  { level: 5, emoji: '😊', label: '开心', color: 'from-green-400 to-teal-500' },
  { level: 6, emoji: '😄', label: '很开心', color: 'from-blue-400 to-cyan-500' },
  { level: 7, emoji: '🤩', label: '超棒', color: 'from-purple-400 to-pink-500' },
];

const energyOptions = [
  { level: 1, label: '1', desc: '没力气', color: 'bg-red-100 text-red-600' },
  { level: 2, label: '2', desc: '困倦', color: 'bg-orange-100 text-orange-600' },
  { level: 3, label: '3', desc: '懒散', color: 'bg-yellow-100 text-yellow-600' },
  { level: 4, label: '4', desc: '还行', color: 'bg-lime-100 text-lime-600' },
  { level: 5, label: '5', desc: '正常', color: 'bg-green-100 text-green-600' },
  { level: 6, label: '6', desc: '精神', color: 'bg-teal-100 text-teal-600' },
  { level: 7, label: '7', desc: '充沛', color: 'bg-blue-100 text-blue-600' },
  { level: 8, label: '8', desc: '活跃', color: 'bg-indigo-100 text-indigo-600' },
  { level: 9, label: '9', desc: '高涨', color: 'bg-purple-100 text-purple-600' },
  { level: 10, label: '10', desc: '满格', color: 'bg-pink-100 text-pink-600' },
];

export default function MoodWeather({ onNext }: { onNext: () => void }) {
  const { username, members, setMoodResult, moodResults } = useStore();
  const [step, setStep] = useState<'mood' | 'energy'>('mood');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const myId = 'me';

  const handleNext = () => {
    if (step === 'mood' && selectedMood !== null) {
      setStep('energy');
      return;
    }
    if (step === 'energy' && selectedEnergy !== null) {
      setMoodResult(myId, selectedMood!, selectedEnergy);
      setShowAllAnswers(true);
      setTimeout(onNext, 3000);
      return;
    }
  };

  const getAverage = (key: 'mood' | 'energy') => {
    const values = Object.values(moodResults).map((r) => r[key]);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {!showAllAnswers ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-br from-brand-500 to-purple-500 p-6 text-white text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 mx-auto mb-4 flex items-center justify-center">
              {step === 'mood' ? <Smile className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">
              {step === 'mood' ? '此刻心情如何？' : '你的能量状态？'}
            </h2>
            <p className="text-white/80">
              {step === 'mood' 
                ? '用 1-7 分给当前心情打分' 
                : '用 1-10 分给能量状态打分'}
            </p>
          </div>

          <div className="p-6">
            {step === 'mood' && (
              <div className="grid grid-cols-7 gap-2">
                {moodOptions.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => setSelectedMood(opt.level)}
                    className={`p-3 rounded-2xl transition-all duration-300 ${
                      selectedMood === opt.level
                        ? `bg-gradient-to-br ${opt.color} text-white scale-110 shadow-lg`
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.emoji}</div>
                    <div className={`text-xs font-medium ${selectedMood === opt.level ? 'text-white' : 'text-gray-600'}`}>
                      {opt.level}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 'energy' && (
              <div className="grid grid-cols-5 gap-2">
                {energyOptions.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => setSelectedEnergy(opt.level)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      selectedEnergy === opt.level
                        ? `${opt.color} scale-105 shadow-md ring-2 ring-offset-2 ring-brand-300`
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`text-xl font-display font-bold ${
                      selectedEnergy === opt.level ? '' : 'text-gray-700'
                    }`}>
                      {opt.label}
                    </div>
                    <div className={`text-xs ${selectedEnergy === opt.level ? '' : 'text-gray-400'}`}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={step === 'mood' ? selectedMood === null : selectedEnergy === null}
              className="w-full mt-6 btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {step === 'mood' ? '下一步：能量打分' : '提交'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl p-6 animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full text-brand-700 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              团队心情报告
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">大家的状态</h2>
            <p className="text-gray-500">看看队友们此刻的心情</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-brand-600">
                {getAverage('mood').toFixed(1)}
              </div>
              <p className="text-sm text-gray-500">平均心情指数</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-display font-bold text-pink-500">
                {getAverage('energy').toFixed(1)}
              </div>
              <p className="text-sm text-gray-500">平均能量值</p>
            </div>
          </div>

          <div className="space-y-2">
            {members.slice(0, 5).map((m) => {
              const result = moodResults[m.id] || moodResults[m.id];
              const hasAnswered = result;
              return (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-pink-100 flex items-center justify-center text-lg">
                    {m.avatar}
                  </div>
                  <span className="font-medium flex-1">
                    {m.id === myId ? `${username}（我）` : m.name}
                  </span>
                  {hasAnswered ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{moodOptions.find((o) => o.level === result!.mood)?.emoji}</span>
                      <span className="text-gray-500">心情 {result!.mood}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">等待中...</span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">即将进入下一个环节...</p>
        </div>
      )}
    </div>
  );
}
