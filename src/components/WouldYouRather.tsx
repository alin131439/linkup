import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ArrowRight, Sparkles, Users, CheckCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    text: '如果可以选择一个超能力，你会选：',
    optionA: { text: '瞬间移动 🌀', emoji: '🌀' },
    optionB: { text: '时间暂停 ⏸️', emoji: '⏸️' },
  },
  {
    id: 2,
    text: '如果现在要去旅行，你会选择：',
    optionA: { text: '撒哈拉沙漠 🏜️', emoji: '🏜️' },
    optionB: { text: '北极冰川 ❄️', emoji: '❄️' },
  },
  {
    id: 3,
    text: '你的理想生活节奏是：',
    optionA: { text: '快节奏都市 🏙️', emoji: '🏙️' },
    optionB: { text: '慢节奏乡村 🌿', emoji: '🌿' },
  },
  {
    id: 4,
    text: '如果必须放弃一种，你会选：',
    optionA: { text: '放弃咖啡 ☕', emoji: '☕' },
    optionB: { text: '放弃甜品 🍰', emoji: '🍰' },
  },
  {
    id: 5,
    text: '周末的放松方式：',
    optionA: { text: '独处充电 🧘', emoji: '🧘' },
    optionB: { text: '聚会社交 🎉', emoji: '🎉' },
  },
];

export default function WouldYouRather({ onNext }: { onNext: () => void }) {
  const { username, wouldYouRatherAnswers, setWouldYouRather } = useStore();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [myAnswer, setMyAnswer] = useState<'A' | 'B' | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [localAnswers, setLocalAnswers] = useState<Record<number, 'A' | 'B'>>({});

  const question = questions[questionIndex];
  const totalQuestions = questions.length;

  const handleSelect = (choice: 'A' | 'B') => {
    setMyAnswer(choice);
    setLocalAnswers({ ...localAnswers, [question.id]: choice });
  };

  const handleNext = () => {
    if (!myAnswer) return;
    setWouldYouRather('me', myAnswer);
    setMyAnswer(null);
    
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setShowResults(true);
      setTimeout(onNext, 4000);
    }
  };

  const getStats = (qId: number) => {
    const answers = Object.values(wouldYouRatherAnswers);
    const mockOthers = Math.floor(Math.random() * 4) + 2;
    const aCount = (localAnswers[qId] === 'A' ? 1 : 0) + Math.floor(mockOthers * 0.5);
    const bCount = (localAnswers[qId] === 'B' ? 1 : 0) + Math.floor(mockOthers * 0.5);
    const total = aCount + bCount;
    return {
      aPercent: total > 0 ? Math.round((aCount / total) * 100) : 50,
      bPercent: total > 0 ? Math.round((bCount / total) * 100) : 50,
    };
  };

  if (showResults) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full text-pink-600 text-sm mb-4">
              <Users className="w-4 h-4" />
              大家的选择
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">有趣的偏好</h2>
            <p className="text-gray-500">看看队友们和你有多少默契</p>
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto">
            {questions.map((q) => {
              const stats = getStats(q.id);
              const myChoice = localAnswers[q.id];
              return (
                <div key={q.id} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-2">{q.text}</p>
                  <div className="flex gap-1">
                    <div
                      className={`flex-1 h-8 rounded-l-lg flex items-center justify-center text-xs font-medium text-white transition-all ${
                        myChoice === 'A' ? 'bg-brand-500 ring-2 ring-offset-1 ring-brand-300' : 'bg-brand-300'
                      }`}
                      style={{ width: `${stats.aPercent}%` }}
                    >
                      {q.optionA.emoji} {stats.aPercent}%
                    </div>
                    <div
                      className={`flex-1 h-8 rounded-r-lg flex items-center justify-center text-xs font-medium text-white transition-all ${
                        myChoice === 'B' ? 'bg-pink-500 ring-2 ring-offset-1 ring-pink-300' : 'bg-pink-300'
                      }`}
                      style={{ width: `${stats.bPercent}%` }}
                    >
                      {q.optionB.emoji} {stats.bPercent}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">正在进入破冰环节...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-br from-pink-500 to-orange-400 p-6 text-white text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">你是否愿意...</h2>
          <p className="text-white/80">
            看似无厘头的问题，能快速让大家放松
          </p>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-center gap-1 mb-4">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i < questionIndex
                    ? 'w-6 bg-brand-400'
                    : i === questionIndex
                    ? 'w-10 bg-brand-500'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">
            第 {questionIndex + 1} / {totalQuestions} 题
          </p>
        </div>

        <div className="p-6">
          <h3 className="font-display font-bold text-xl text-center mb-6">
            {question.text}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSelect('A')}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                myAnswer === 'A'
                  ? 'border-brand-500 bg-brand-50 scale-105 shadow-lg'
                  : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/50'
              }`}
            >
              <div className="text-3xl mb-2">{question.optionA.emoji}</div>
              <div className={`font-medium ${myAnswer === 'A' ? 'text-brand-700' : 'text-gray-700'}`}>
                {question.optionA.text}
              </div>
              {myAnswer === 'A' && (
                <CheckCircle className="w-5 h-5 text-brand-500 mt-2" />
              )}
            </button>

            <button
              onClick={() => handleSelect('B')}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                myAnswer === 'B'
                  ? 'border-pink-500 bg-pink-50 scale-105 shadow-lg'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
              }`}
            >
              <div className="text-3xl mb-2">{question.optionB.emoji}</div>
              <div className={`font-medium ${myAnswer === 'B' ? 'text-pink-700' : 'text-gray-700'}`}>
                {question.optionB.text}
              </div>
              {myAnswer === 'B' && (
                <CheckCircle className="w-5 h-5 text-pink-500 mt-2" />
              )}
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={!myAnswer}
            className="w-full mt-6 btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {questionIndex < totalQuestions - 1 ? '下一题' : '查看结果'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
